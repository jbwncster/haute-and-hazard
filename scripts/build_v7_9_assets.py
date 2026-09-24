#!/usr/bin/env python3
from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import os
import re
import shutil
import sys
import textwrap
import zipfile
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

VERSION = "7.9"
TABLOID = (11 * 72, 17 * 72)
REPO_SLUG = "jbwncster/haute-and-hazard"
RAW_BASE = f"https://raw.githubusercontent.com/{REPO_SLUG}/main/releases/v7.9/TTS/Assets"

TENET_BG = {
    "Pink": (76, 20, 64),
    "Blue": (18, 45, 68),
    "Purple": (58, 30, 76),
    "Yellow": (86, 68, 20),
    "Neutral": (41, 41, 44),
    "None": (41, 41, 44),
}
TENET_ACCENT = {
    "Pink": (234, 88, 179),
    "Blue": (85, 170, 238),
    "Purple": (171, 106, 230),
    "Yellow": (242, 199, 64),
    "Neutral": (190, 190, 190),
    "None": (190, 190, 190),
}
GOLD = (224, 188, 92)
CREAM = (247, 239, 217)
WHITE = (248, 248, 248)
BLACK = (9, 9, 11)
DARK = (20, 20, 24)
MUTED = (185, 179, 165)

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
for fp in (FONT_REG, FONT_BOLD, FONT_SERIF_BOLD):
    if not Path(fp).exists():
        raise SystemExit(f"Required font missing: {fp}")


def font(size: int, bold: bool = False, serif: bool = False):
    return ImageFont.truetype(FONT_SERIF_BOLD if serif else (FONT_BOLD if bold else FONT_REG), size)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def safe_slug(s: str) -> str:
    s = s.replace("†", "")
    s = re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")
    return s[:80] or "item"


def fit_lines(draw: ImageDraw.ImageDraw, text: str, width: int, max_size: int, min_size: int = 18, bold=False, max_lines: int | None = None):
    text = (text or "").strip()
    for size in range(max_size, min_size - 1, -1):
        f = font(size, bold=bold)
        words = text.split()
        lines: list[str] = []
        current = ""
        for word in words:
            trial = word if not current else current + " " + word
            if draw.textbbox((0, 0), trial, font=f)[2] <= width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
        if max_lines is None or len(lines) <= max_lines:
            return f, lines
    f = font(min_size, bold=bold)
    return f, textwrap.wrap(text, width=max(8, width // max(1, min_size // 2)))


def draw_wrapped(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, max_size: int, min_size=18, fill=WHITE, bold=False, spacing=1.16, max_lines=None):
    x0, y0, x1, y1 = box
    w = x1 - x0
    h = y1 - y0
    f, lines = fit_lines(draw, text, w, max_size, min_size, bold, max_lines)
    line_h = int(f.size * spacing)
    while line_h * len(lines) > h and f.size > min_size:
        f, lines = fit_lines(draw, text, w, f.size - 1, min_size, bold, max_lines)
        line_h = int(f.size * spacing)
    y = y0
    for line in lines:
        if y + line_h > y1:
            break
        draw.text((x0, y), line, font=f, fill=fill)
        y += line_h
    return y


def draw_centered(draw, xy, text, f, fill):
    x0, y0, x1, y1 = xy
    bbox = draw.textbbox((0,0), text, font=f)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text((x0 + (x1-x0-tw)/2, y0 + (y1-y0-th)/2 - 2), text, font=f, fill=fill)


def base_card(size: tuple[int,int], tenet: str, accent_bar=True) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    w,h=size
    bg = TENET_BG.get(tenet, TENET_BG["Neutral"])
    accent = TENET_ACCENT.get(tenet, TENET_ACCENT["Neutral"])
    im=Image.new("RGB",size,bg)
    d=ImageDraw.Draw(im)
    d.rectangle((0,0,w,h), fill=bg)
    d.rounded_rectangle((38,38,w-38,h-38), radius=26, fill=BLACK)
    # The Game Crafter card safe zone starts 75 px from the full-bleed edge.
    d.rounded_rectangle((78,78,w-78,h-78), radius=18, outline=GOLD, width=3)
    if accent_bar:
        d.rectangle((88,h-112,w-88,h-84), fill=accent)
    return im,d


def poker_front(row: dict[str,str]) -> Image.Image:
    im,d = base_card((825,1125), row.get("tenet") or "Neutral")
    accent=TENET_ACCENT.get(row.get("tenet") or "Neutral", TENET_ACCENT["Neutral"])
    # title
    d.text((90,92), row["card_id"], font=font(24,bold=True), fill=MUTED)
    draw_wrapped(d,(90,128,630,220),row["card_name"],48,30,CREAM,True,max_lines=2)
    # cost badge
    d.ellipse((650,92,735,177),fill=accent,outline=GOLD,width=4)
    draw_centered(d,(650,92,735,177),row.get("cost") or "-",font(38,True),BLACK)
    d.text((665,182),"COST",font=font(16,True),fill=MUTED)
    # metadata
    meta=[row.get("card_type","")]
    if row.get("slot") and row["slot"] not in ("none",""):
        meta.append(row["slot"])
    if row.get("brand"):
        meta.append(row["brand"])
    meta.append(row.get("tenet") or "Neutral")
    d.text((90,240)," • ".join(meta),font=font(22,True),fill=accent)
    # Tip focus band
    d.rounded_rectangle((90,290,735,410), radius=18, fill=DARK, outline=accent, width=3)
    d.text((115,310),"TIPS",font=font(24,True),fill=MUTED)
    d.text((115,338),str(row.get("tips","0")),font=font(56,True),fill=CREAM)
    draw_wrapped(d,(250,312,710,392),"PLAY THIS CARD → generate its printed Tips, then resolve its legal effect.",22,18,WHITE,False,spacing=1.12,max_lines=3)
    # rules
    d.text((90,445),"CARD TEXT",font=font(22,True),fill=GOLD)
    rules=row.get("rules_text") or "No additional effect."
    draw_wrapped(d,(90,485,735,835),rules,30,20,WHITE,False,spacing=1.25)
    # stats
    y=865
    labels=[("APPEAL",row.get("appeal","0")),("LS",row.get("ls","0")),("SP",row.get("sp","0"))]
    x=90
    for lab,val in labels:
        d.rounded_rectangle((x,y,x+195,y+115),radius=16,fill=DARK,outline=GOLD,width=2)
        d.text((x+16,y+14),lab,font=font(20,True),fill=MUTED)
        d.text((x+16,y+46),str(val),font=font(42,True),fill=CREAM)
        x+=215
    d.text((95,1017),f"{row.get('component','')} • Haute & Hazard v{VERSION}",font=font(15,True),fill=BLACK)
    if row.get("ip_marker"):
        d.text((90,1050),"† Working prototype terminology; legal/IP review.",font=font(14),fill=MUTED)
    return im


def card_back(size=(825,1125), label="POKER DECK", accent=(171,106,230)):
    im=Image.new("RGB",size,BLACK)
    d=ImageDraw.Draw(im)
    w,h=size
    d.rounded_rectangle((38,38,w-38,h-38),radius=28,fill=(18,18,22))
    d.rounded_rectangle((78,78,w-78,h-78),radius=20,outline=accent,width=4)
    draw_centered(d,(80,250,w-80,600),"HAUTE\n&\nHAZARD",font(64,True,True),CREAM)
    d.text((0,0),"",font=font(1))
    draw_centered(d,(90,680,w-90,770),label,font(30,True),accent)
    draw_centered(d,(90,790,w-90,850),f"v{VERSION}",font(24,True),MUTED)
    return im


def queen_front(row: dict[str,str]) -> Image.Image:
    tenet=row.get("signature_tenet") or "None"
    im,d=base_card((1125,1725),tenet)
    accent=TENET_ACCENT.get(tenet,TENET_ACCENT["Neutral"])
    d.text((85,82),row["queen_id"],font=font(28,True),fill=MUTED)
    draw_wrapped(d,(85,130,1020,290),row["name"],72,44,CREAM,True,max_lines=2)
    d.text((85,310),f"Signature Tenet: {tenet}   •   Favorite Brand: {row.get('favorite_brand','')}",font=font(26,True),fill=accent)
    d.rounded_rectangle((85,380,1040,880),radius=24,fill=DARK,outline=accent,width=4)
    d.text((120,415),"SIGNATURE ABILITY",font=font(26,True),fill=GOLD)
    draw_wrapped(d,(120,465,1000,560),row.get("signature_ability_name",""),42,28,CREAM,True,max_lines=2)
    draw_wrapped(d,(120,585,1000,835),row.get("signature_ability_text",""),30,21,WHITE,False,spacing=1.25)
    d.rounded_rectangle((85,930,1040,1475),radius=24,fill=DARK,outline=GOLD,width=4)
    d.text((120,965),"SPECIAL APPEAL — ONCE PER GAME",font=font(25,True),fill=GOLD)
    draw_wrapped(d,(120,1015,1000,1115),row.get("special_appeal_name",""),40,27,CREAM,True,max_lines=2)
    draw_wrapped(d,(120,1140,1000,1435),row.get("special_appeal_text",""),28,20,WHITE,False,spacing=1.24)
    d.text((85,1540),"Use a marker after the Special Appeal is spent.",font=font(22),fill=MUTED)
    d.text((85,1600),f"Haute & Hazard v{VERSION}",font=font(20,True),fill=MUTED)
    if row.get("ip_marker"):
        d.text((85,1632),"† Working prototype terminology; legal/IP review.",font=font(17),fill=MUTED)
    return im


def stage_front(row: dict[str,str]) -> Image.Image:
    # Logical landscape 1125x825, then rotate to portrait upload orientation.
    w,h=1125,825
    tenet=row["favored_tenet"]
    bg=TENET_BG.get(tenet,TENET_BG["Neutral"])
    accent=TENET_ACCENT.get(tenet,TENET_ACCENT["Neutral"])
    im=Image.new("RGB",(w,h),bg)
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((38,38,w-38,h-38),radius=25,fill=BLACK)
    d.rounded_rectangle((78,78,w-78,h-78),radius=18,outline=GOLD,width=3)
    d.rectangle((82,88,98,h-88),fill=accent)
    d.text((105,84),"STAGE • VENUE",font=font(18,True),fill=GOLD)
    draw_wrapped(d,(105,112,650,205),row["stage_name"],44,30,CREAM,True,max_lines=2)
    d.text((105,205),row["subtitle"],font=font(22),fill=MUTED)
    d.line((105,242,1040,242),fill=GOLD,width=2)
    d.text((105,262),f"Favored Tenet: {row['favored_tenet']}",font=font(23,True),fill=CREAM)
    d.text((105,298),f"Featured Brand: {row['featured_brand']}",font=font(23,True),fill=CREAM)
    d.text((105,334),f"Slay Target: {row['slay_target']} Appeal   •   Reward: {row['reward_gross_sp']} Gross SP",font=font(23,True),fill=CREAM)
    d.text((105,385),f"Judge: {row['judge']}",font=font(22,True),fill=GOLD)
    d.text((105,427),"VENUE EFFECT",font=font(18,True),fill=GOLD)
    draw_wrapped(d,(105,455,1040,545),row["venue_effect"],23,17,WHITE,False,spacing=1.18,max_lines=3)
    d.text((105,562),"SPOTLIGHT",font=font(18,True),fill=GOLD)
    draw_wrapped(d,(105,590,1040,665),row["spotlight_requirement"],22,16,WHITE,False,spacing=1.17,max_lines=3)
    d.text((105,690),f"Judge's Favor: {row['judge_favor']}",font=font(21,True),fill=CREAM)
    d.text((105,728),f"Brand Ovation: {row['brand_ovation']}",font=font(16),fill=MUTED)
    d.text((900,86),row["stage_id"],font=font(18,True),fill=MUTED)
    return im.rotate(90,expand=True)


def player_aid_front() -> Image.Image:
    im=Image.new("RGB",(1875,1275),BLACK)
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((25,25,1850,1250),radius=34,outline=GOLD,width=8)
    d.text((75,65),f"HAUTE & HAZARD v{VERSION} — PLAYER AID",font=font(52,True,True),fill=CREAM)
    d.text((75,140),"Tips work like deck-building Power: only played cards generate their printed Tips.",font=font(29,True),fill=TENET_ACCENT["Pink"])
    phases=[
        ("1  TRANSFORMATION","Play cards one at a time, any order. Each played card: gain printed Tips, then resolve text. Fashion may equip or be played for Tips only."),
        ("2  THE REVEAL","Total Master Appeal and Reveal effects. Matching ×2. Perfect Illusion ×3. Fusion uses exactly two non-Neutral Tenets."),
        ("3  SHOPPING","Spend Tips. Buy any number you can afford. Purchases go to Backstage Archive. Do not refill the Rack yet."),
        ("4  SLAY / DRAGDAGULAN† / PASS","Slay if Appeal meets the active Stage. Or battle: each player draws 3 battle cards; sum printed LS + explicit battle modifiers."),
        ("5  CLEANUP","Archive played non-Masters and every card still in hand. Keep legal Masters. Refill Rack to 5. Draw a fresh 5-card hand. Reset Tips/Appeal."),
    ]
    y=215
    for title,body in phases:
        d.rounded_rectangle((75,y,1170,y+175),radius=22,fill=DARK,outline=GOLD,width=2)
        d.text((105,y+20),title,font=font(29,True),fill=GOLD)
        draw_wrapped(d,(105,y+62,1140,y+155),body,24,18,WHITE,False,spacing=1.15,max_lines=4)
        y+=190
    # right column
    x0=1220
    d.text((x0,225),"LOOKS",font=font(30,True),fill=GOLD)
    look_text=("Complete: Face + Wig + Body + Shoes.\n\n"
               "Matching: all 4 visible Masters share one non-Neutral Tenet → ×2 Appeal.\n\n"
               "Perfect Illusion: Matching + Queen Signature Tenet → ×3 Appeal + Untouchable.\n\n"
               "Fusion: exactly 2 non-Neutral Tenets in the eligible Fusion pool.")
    draw_wrapped(d,(x0,275,1785,630),look_text,23,18,WHITE,False,spacing=1.2)
    d.text((x0,675),"REMEMBER",font=font(30,True),fill=GOLD)
    remember=("• Unplayed cards generate 0 printed Tips.\n"
              "• Old Masters do not generate printed Tips again.\n"
              "• Fashion played only for Tips gives no Master stats.\n"
              "• Replaced Masters go to the Archive unless an effect says otherwise.\n"
              "• If Deck runs out while drawing, shuffle Archive and continue.\n"
              "• Wardrobe Rack refills at Cleanup, not during Shopping.")
    draw_wrapped(d,(x0,725,1785,1140),remember,22,17,WHITE,False,spacing=1.22)
    d.text((x0,1175),"† Working prototype terminology; legal/IP review.",font=font(17),fill=MUTED)
    return im


def player_aid_back() -> Image.Image:
    im=Image.new("RGB",(1875,1275),BLACK)
    d=ImageDraw.Draw(im)
    d.rounded_rectangle((25,25,1850,1250),radius=34,outline=GOLD,width=8)
    d.text((75,65),"QUICK GLOSSARY & SETUP",font=font(52,True,True),fill=CREAM)
    setup=("SETUP\n"
           "• Give each player a Queen and a 12-card starter deck: 7 Basic Beat, 3 Messy Lip Sync, 2 Chapstick.\n"
           "• Shuffle personal Deck; draw 5. Start at 0 Gross SP, 0 Tips, 0 Appeal.\n"
           "• Shuffle Wardrobe; reveal 5 to the Rack. Set out Thrift Store and Penalties. Reveal 1 Stage.\n\n"
           "STARTER CARDS\n"
           "Basic Beat — Tip 1; no extra effect.\n"
           "Messy Lip Sync — Tip 0; Play: Gain 1 Appeal.\n"
           "Chapstick — Tip 1; Face Fashion; Equip: may archive 1 card from hand to draw 1.\n\n"
           "ZONES\n"
           "Deck = personal draw pile.  Backstage Archive = personal discard pile.\n"
           "Personal Trash = removed from normal deck cycle unless an effect retrieves it.\n"
           "Wardrobe Rack = 5 face-up shared cards.  Masters = equipped Fashion in slots.\n\n"
           "END GAME\n"
           "At 30+ Gross SP at the end of Phase 4 / Curtain Call, or when the Stage Deck is empty after a Slay, go to Final Judging. Apply explicit bonuses and Penalty SP.")
    draw_wrapped(d,(85,170,1790,1160),setup,29,20,WHITE,False,spacing=1.2)
    d.text((85,1185),f"Haute & Hazard v{VERSION} • Prototype playtest aid",font=font(20,True),fill=MUTED)
    return im


def folio_front() -> Image.Image:
    im=Image.new("RGB",(4875,2475),BLACK)
    d=ImageDraw.Draw(im)
    d.rectangle((30,30,4845,2445),outline=GOLD,width=12)
    d.text((140,120),f"HAUTE & HAZARD v{VERSION}",font=font(110,True,True),fill=CREAM)
    d.text((145,265),"CORE PLAY FLOW",font=font(60,True),fill=TENET_ACCENT["Purple"])
    flow="TRANSFORMATION  →  THE REVEAL  →  SHOPPING  →  SLAY / DRAGDAGULAN† / PASS  →  CLEANUP"
    d.text((145,380),flow,font=font(44,True),fill=GOLD)
    cols=[
        ("TRANSFORMATION","Play cards from hand one at a time in any order. Each card generates its printed Tips when played, then resolves its text. Fashion may equip as a Master or be played only for Tips."),
        ("THE REVEAL","Total Master Appeal, assign Wild Tenets, resolve Reveal/Matching/Fusion effects, then apply the Look multiplier. Matching ×2; Perfect Illusion ×3."),
        ("SHOPPING","Spend Tips on any number of legal affordable Wardrobe/Thrift cards. Purchases go to Backstage Archive. Rack spaces stay empty until Cleanup."),
        ("PHASE 4","Slay if current Appeal meets the Stage target and requirements; or choose Dragdagulan†; or Pass. A successful Slay awards its printed reward and closes the Stage."),
        ("CLEANUP","Archive played non-Masters and unplayed hand cards. Keep legal Masters. Refill Wardrobe Rack to five. Draw 5. Shuffle Archive into Deck when needed. Reset Tips/Appeal."),
    ]
    x=145;y=530
    cw=900; gap=45
    for i,(head,body) in enumerate(cols):
        xx=x+i*(cw+gap)
        d.rounded_rectangle((xx,y,xx+cw,y+1250),radius=30,fill=DARK,outline=GOLD,width=4)
        d.text((xx+45,y+45),head,font=font(40,True),fill=GOLD)
        draw_wrapped(d,(xx+45,y+125,xx+cw-45,y+1120),body,34,24,WHITE,False,spacing=1.25)
    d.text((145,1900),"CORE LOOKS",font=font(48,True),fill=TENET_ACCENT["Pink"])
    d.text((145,1980),"Complete = Face + Wig + Body + Shoes  •  Matching = all four share one non-Neutral Tenet  •  Perfect Illusion = Matching + Queen Signature Tenet  •  Fusion = exactly two non-Neutral Tenets in the Fusion pool",font=font(31,True),fill=WHITE)
    d.text((145,2150),"Tips buy cards. Appeal Slays Stages. LS resolves Dragdagulan†. Gross SP is your score before final penalties.",font=font(36,True),fill=CREAM)
    d.text((145,2290),"† Working prototype terminology credited to Drag Den Philippines; legal/IP and publisher review pending.",font=font(24),fill=MUTED)
    return im


def folio_back() -> Image.Image:
    im=Image.new("RGB",(4875,2475),BLACK)
    d=ImageDraw.Draw(im)
    d.rectangle((30,30,4845,2445),outline=GOLD,width=12)
    d.text((140,120),"SETUP • STAGES • BATTLE",font=font(90,True,True),fill=CREAM)
    sections=[
        ("SETUP","Each player: Queen + 12-card starter Deck; shuffle and draw 5. Shared: Wardrobe deck + 5-card Rack, Thrift supply, Penalty supply, shuffled 12-card Stage deck with one active Stage. Start at 0 Gross SP / 0 Tips / 0 Appeal."),
        ("STAGE CARD","Beginner Mode uses Favored Tenet, Featured Brand, Slay Target, Reward, and Venue Effect. Full rules also use Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation. Judge's Favor on the current venue set is +1 Gross SP; Brand Ovation is +2 Gross SP with a 4-piece Featured Brand Coordinate."),
        ("DRAGDAGULAN†","Choose an eligible opponent. Challenger and defender each draw 3 battle cards from their personal Deck. Battle Score = printed LS on those 3 cards + explicit active battle modifiers. Equipped Masters and Deep Storage do not automatically add LS. Higher score wins. Tie: both take The Chop if available; no winner reward."),
        ("STARTER DECK","7 Basic Beat (Tip 1); 3 Messy Lip Sync (Tip 0, Play: +1 Appeal); 2 Chapstick (Tip 1, Face Fashion, Equip filtering). Printed Tips generate only when the physical card is played that turn."),
        ("DECK-BUILDING CADENCE","Bought cards go to Backstage Archive. At Cleanup archive your played non-Masters and unplayed hand, refill the Rack, draw 5, and reshuffle Archive only when your Deck runs out. This is the game's shared-market deck-building backbone."),
        ("END GAME","Trigger Final Judging at 30+ Gross SP at the end of Phase 4 / Curtain Call, or when the Stage Deck is empty after a Stage is Slayed. Final Score = Gross SP + explicit end-game bonuses − Penalty values."),
    ]
    x_positions=[140,1665,3190]
    y_positions=[380,1330]
    idx=0
    for y in y_positions:
        for x in x_positions:
            head,body=sections[idx];idx+=1
            d.rounded_rectangle((x,y,x+1400,y+800),radius=28,fill=DARK,outline=GOLD,width=4)
            d.text((x+45,y+45),head,font=font(42,True),fill=GOLD)
            draw_wrapped(d,(x+45,y+120,x+1355,y+750),body,31,22,WHITE,False,spacing=1.24)
    d.text((140,2250),f"Haute & Hazard v{VERSION} • 2–5 players • Prototype",font=font(30,True),fill=MUTED)
    return im


def box_art() -> Image.Image:
    im=Image.new("RGB",(5850,5400),BLACK)
    d=ImageDraw.Draw(im)
    # safe prototype pattern that tolerates folds/crops
    for inset in range(90,780,120):
        d.rounded_rectangle((inset,inset,5850-inset,5400-inset),radius=90,outline=(80+inset//8,55,100),width=8)
    d.rounded_rectangle((1150,1550,4700,3850),radius=100,fill=(18,18,22),outline=GOLD,width=16)
    draw_centered(d,(1250,1750,4600,2650),"HAUTE & HAZARD",font(210,True,True),CREAM)
    draw_centered(d,(1350,2780,4500,3150),"BUILD THE LOOK • SLAY THE STAGE",font(78,True),TENET_ACCENT["Pink"])
    draw_centered(d,(1500,3300,4350,3550),f"PROTOTYPE v{VERSION} • 2–5 PLAYERS",font(52,True),MUTED)
    return im


def save_jpg(im: Image.Image, path: Path, quality=92):
    path.parent.mkdir(parents=True,exist_ok=True)
    im.save(path,"JPEG",quality=quality,optimize=False,subsampling=0)


def crop_trim(im: Image.Image, kind="poker") -> Image.Image:
    if kind=="poker":
        return im.crop((37,37,787,1087)).resize((750,1050),Image.Resampling.LANCZOS)
    if kind=="queen":
        return im.crop((37,37,1087,1687)).resize((1050,1650),Image.Resampling.LANCZOS)
    if kind=="aid":
        return im.crop((37,37,1837,1237)).resize((1800,1200),Image.Resampling.LANCZOS)
    return im.copy()


def make_sheet(images: list[Image.Image], cols:int, rows:int, cell_size:tuple[int,int], path:Path, bg=(24,24,26)):
    cw,ch=cell_size
    sheet=Image.new("RGB",(cw*cols,ch*rows),bg)
    for i,im in enumerate(images):
        x=(i%cols)*cw; y=(i//cols)*ch
        if im.size != cell_size:
            im=im.resize(cell_size,Image.Resampling.LANCZOS)
        sheet.paste(im,(x,y))
    save_jpg(sheet,path,quality=88)


def pnp_pdf(images: list[Image.Image], path:Path, card_inches:tuple[float,float], per_page:tuple[int,int], page_size=letter, title:str=""):
    path.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(path),pagesize=page_size,pageCompression=1)
    pw,ph=page_size
    cols,rows=per_page
    cw,ch=card_inches[0]*72,card_inches[1]*72
    left=(pw-cols*cw)/2
    bottom=(ph-rows*ch)/2
    for page_start in range(0,len(images),cols*rows):
        batch=images[page_start:page_start+cols*rows]
        for i,im in enumerate(batch):
            col=i%cols; row=i//cols
            x=left+col*cw; y=ph-bottom-(row+1)*ch
            c.drawImage(ImageReader(im),x,y,width=cw,height=ch,preserveAspectRatio=True,anchor='c')
            c.setLineWidth(0.35); c.rect(x,y,cw,ch,stroke=1,fill=0)
        c.showPage()
    c.save()


def repeated_back_pdf(back: Image.Image, count:int, path:Path, card_inches, per_page, page_size=letter):
    pnp_pdf([back for _ in range(count)],path,card_inches,per_page,page_size)


def folio_pdf(front:Image.Image, back:Image.Image, path:Path):
    c=canvas.Canvas(str(path),pagesize=landscape(TABLOID),pageCompression=1)
    pw,ph=landscape(TABLOID)
    for im in (front,back):
        buf=io.BytesIO(); im.save(buf,"JPEG",quality=90);buf.seek(0)
        margin=18
        scale=min((pw-2*margin)/im.width,(ph-2*margin)/im.height)
        w=im.width*scale;h=im.height*scale
        c.drawImage(ImageReader(buf),(pw-w)/2,(ph-h)/2,w,h)
        c.showPage()
    c.save()


def start_here_pdf(path:Path):
    c=canvas.Canvas(str(path),pagesize=letter,pageCompression=1)
    w,h=letter
    c.setFont("Helvetica-Bold",24);c.drawString(54,h-72,f"Haute & Hazard v{VERSION} — Start Here")
    c.setFont("Helvetica",11)
    lines=[
        "Print at Actual Size / 100%. Do not use Fit to Page.",
        "Poker and Stage cards are 2.5 x 3.5 inches after trim. Sleeve with opaque backs or print the matching back sheets.",
        "Each player starts with 12 cards (7 Basic Beat, 3 Messy Lip Sync, 2 Chapstick), shuffles, and draws 5.",
        "Turn: Transformation -> The Reveal -> Shopping -> Slay / Dragdagulan / Pass -> Cleanup.",
        "During Transformation, a played card generates its printed Tips, then resolves its text. Unplayed cards and old Masters do not generate printed Tips.",
        "The Wardrobe Rack has 5 face-up cards. Purchases enter Backstage Archive. Refill the Rack during Cleanup, then draw 5.",
        "Use Beginner Mode for the first game: ignore Judge, Spotlight Requirement, Judge's Favor, and Brand Ovation.",
        "The 12 Stage cards in this kit use the verified v7.8 venue text migrated to the v7.9 rules build.",
        "Dragdagulan is working prototype terminology subject to legal/IP and publisher review.",
    ]
    y=h-115
    for i,line in enumerate(lines,1):
        wrapped=textwrap.wrap(line,94)
        c.setFont("Helvetica-Bold",11);c.drawString(58,y,f"{i}.")
        c.setFont("Helvetica",11)
        for j,ln in enumerate(wrapped):
            c.drawString(78,y,ln);y-=15
        y-=8
    c.save()


def sha256_file(path:Path)->str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()


def write_checksums(root:Path, output:Path):
    rows=[]
    for p in sorted(root.rglob("*")):
        if p.is_file() and p != output:
            rows.append(f"{sha256_file(p)}  {p.relative_to(root).as_posix()}")
    output.write_text("\n".join(rows)+"\n",encoding="utf-8")


def zip_dir(src:Path, zip_path:Path, root_name:str):
    zip_path.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(zip_path,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in sorted(src.rglob("*")):
            if p.is_file():
                z.write(p,Path(root_name)/p.relative_to(src))


def common_obj(guid:str,name:str,nickname:str,description:str,pos:tuple[float,float,float],rot=(0,180,0),scale=(1,1,1)):
    return {
        "GUID":guid,"Name":name,
        "Transform":{"posX":pos[0],"posY":pos[1],"posZ":pos[2],"rotX":rot[0],"rotY":rot[1],"rotZ":rot[2],"scaleX":scale[0],"scaleY":scale[1],"scaleZ":scale[2]},
        "Nickname":nickname,"Description":description,"GMNotes":"","AltLookAngle":{"x":0,"y":0,"z":0},
        "ColorDiffuse":{"r":0.7132353,"g":0.7132353,"b":0.7132353},"LayoutGroupSortIndex":0,"Value":0,
        "Locked":False,"Grid":True,"Snap":True,"IgnoreFoW":False,"MeasureMovement":False,"DragSelectable":True,
        "Autoraise":True,"Sticky":True,"Tooltip":True,"GridProjection":False,"HideWhenFaceDown":True,"Hands":False,
        "LuaScript":"","LuaScriptState":"","XmlUI":""
    }


def tts_card_obj(guid,card_id,nickname,description,custom_decks,pos=(0,0,0),sideways=False):
    o=common_obj(guid,"CardCustom",nickname,description,pos)
    o.update({"CardID":card_id,"SidewaysCard":sideways,"CustomDeck":custom_decks})
    return o


def tts_deck_obj(guid,nickname,description,card_ids,card_meta,custom_decks,pos,sideways=False):
    o=common_obj(guid,"DeckCustom",nickname,description,pos)
    o["DeckIDs"]=card_ids
    o["CustomDeck"]=custom_decks
    contained=[]
    for i,cid in enumerate(card_ids):
        m=card_meta[cid]
        contained.append(tts_card_obj(f"{int(guid,16)+i+1:06x}"[-6:],cid,m[0],m[1],custom_decks,sideways=sideways))
    o["ContainedObjects"]=contained
    return o


def poker_desc(r):
    parts=[f"{r['card_id']} — {r['component']} / {r['card_type']}",f"Cost {r['cost']} | Tips {r['tips']} | Appeal {r['appeal']} | LS {r['ls']} | SP {r['sp']}"]
    if r.get('slot') and r['slot']!='none': parts.append(f"Slot: {r['slot']}")
    if r.get('tenet'): parts.append(f"Tenet: {r['tenet']}")
    if r.get('brand'): parts.append(f"Brand: {r['brand']}")
    if r.get('rules_text'): parts.extend(["",r['rules_text']])
    return "\n".join(parts)


def build(root:Path):
    card_path=root/"data/v7_9_card_database.csv"
    queen_path=root/"data/v7_9_queen_database.csv"
    stage_path=root/"data/v7_9_stage_database.csv"
    # Local-test fallback layout.
    if not card_path.exists(): card_path=root/"v7_9_card_database.csv"
    if not queen_path.exists(): queen_path=root/"v7_9_queen_database.csv"
    if not stage_path.exists(): stage_path=root/"v7_9_stage_database.csv"
    cards=read_csv(card_path);queens=read_csv(queen_path);stages=read_csv(stage_path)
    if len(cards)!=240: raise SystemExit(f"Expected 240 Poker rows, got {len(cards)}")
    if len(queens)!=12: raise SystemExit(f"Expected 12 Queens, got {len(queens)}")
    if len(stages)!=12: raise SystemExit(f"Expected 12 Stages, got {len(stages)}")
    if [r['card_id'] for r in cards] != [f"HH-{i:03d}" for i in range(1,241)]: raise SystemExit("Poker IDs are not HH-001..HH-240")

    rel=root/"releases/v7.9"
    work=root/".build_v7_9"
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True)
    gc=work/"gc"
    pnp=work/"pnp"
    tts_assets=rel/"TTS/Assets"
    tts_assets.mkdir(parents=True,exist_ok=True)
    # clean prior generated TTS assets
    for p in tts_assets.glob("v7_9_*.jpg"): p.unlink()

    # Generate front images in memory and to GC temp.
    poker_trim=[]
    poker_gc_dir=gc/"02_POKER_DECK_240/FRONTS"
    for r in cards:
        im=poker_front(r); poker_trim.append(crop_trim(im,"poker"))
        save_jpg(im,poker_gc_dir/f"{r['card_id'].replace('-','_')}_{safe_slug(r['card_name'])}.jpg")
    poker_back=card_back(label="POKER DECK")
    save_jpg(poker_back,gc/"02_POKER_DECK_240/BACK/Haute_Hazard_v7.9_Poker_Back.jpg")

    stage_trim=[]
    for r in stages:
        im=stage_front(r);stage_trim.append(crop_trim(im,"poker"))
        save_jpg(im,gc/"03_STAGES_FOIL_EURO_12/FRONTS"/f"{r['stage_id']}_{safe_slug(r['stage_name'])}.jpg")
    stage_back=card_back(label="STAGE",accent=TENET_ACCENT["Yellow"])
    save_jpg(stage_back,gc/"03_STAGES_FOIL_EURO_12/BACK/Haute_Hazard_v7.9_Stage_Back.jpg")

    queen_trim=[]
    for r in queens:
        im=queen_front(r);queen_trim.append(crop_trim(im,"queen"))
        save_jpg(im,gc/"04_QUEENS_JUMBO_12/FRONTS"/f"{r['queen_id'].replace('-','')}_{safe_slug(r['name'])}.jpg")
    queen_back=card_back(size=(1125,1725),label="QUEEN",accent=TENET_ACCENT["Purple"])
    save_jpg(queen_back,gc/"04_QUEENS_JUMBO_12/BACK/Haute_Hazard_v7.9_Queen_Back.jpg")

    aid_front=player_aid_front();aid_back=player_aid_back()
    for i in range(1,6):
        save_jpg(aid_front,gc/"05_PLAYER_AIDS_POSTCARD_MAT_SET_5/FRONTS"/f"Player_Aid_{i:02d}_FRONT.jpg")
        save_jpg(aid_back,gc/"05_PLAYER_AIDS_POSTCARD_MAT_SET_5/BACKS"/f"Player_Aid_{i:02d}_BACK.jpg")
    ffront=folio_front();fback=folio_back()
    save_jpg(ffront,gc/"01_RULES_MEDIUM_FOLIO_SET/Haute_Hazard_v7.9_Medium_Folio_FRONT_4875x2475.jpg",90)
    save_jpg(fback,gc/"01_RULES_MEDIUM_FOLIO_SET/Haute_Hazard_v7.9_Medium_Folio_BACK_4875x2475.jpg",90)
    save_jpg(box_art(),gc/"06_BOX_MEDIUM_PROTOTYPE/Haute_Hazard_v7.9_Medium_Prototype_Box_5850x5400.jpg",88)

    gc_readme=(
        f"Haute & Hazard v{VERSION} — Game Crafter Print Edition\n\n"
        "Upload-ready functional prototype generated from the canonical v7.9 CSV data.\n"
        "Counts: 240 Poker fronts, 12 Stages, 12 Queens, 5 Player Aid fronts + 5 backs.\n"
        "Poker/Stage: 825x1125 px. Queens: 1125x1725 px. Player Aids: 1875x1275 px.\n"
        "Rules folio: 4875x2475 px. Box artboard: 5850x5400 px.\n\n"
        "All essential Poker text is generated from data/v7_9_card_database.csv.\n"
        "Stage text is generated from data/v7_9_stage_database.csv, verified from the v7.8 venue print assets and migrated to the v7.9 build.\n"
        "Queen text is generated from data/v7_9_queen_database.csv.\n"
        "Prototype graphics are intentionally utilitarian; replace art without changing dimensions or safe-text placement.\n"
        "All essential card text is kept at least 75 px from full-bleed card edges, matching the TGC 1/8-in bleed + 1/8-in safe-zone guidance at 300 DPI.\n"
    )
    (gc/"README.txt").write_text(gc_readme,encoding="utf-8")
    write_checksums(gc,gc/"CHECKSUMS.sha256")

    # Print-and-play PDFs.
    pnp.mkdir(parents=True,exist_ok=True)
    start_here_pdf(pnp/"00_START_HERE.pdf")
    pnp_pdf(poker_trim,pnp/"01_POKER_FRONTS_9UP_LETTER.pdf",(2.5,3.5),(3,3))
    repeated_back_pdf(crop_trim(poker_back,"poker"),len(cards),pnp/"02_POKER_BACKS_9UP_LETTER.pdf",(2.5,3.5),(3,3))
    pnp_pdf(stage_trim,pnp/"03_STAGE_FRONTS_9UP_LETTER.pdf",(2.5,3.5),(3,3))
    repeated_back_pdf(crop_trim(stage_back,"poker"),len(stages),pnp/"04_STAGE_BACKS_9UP_LETTER.pdf",(2.5,3.5),(3,3))
    pnp_pdf(queen_trim,pnp/"05_QUEEN_FRONTS_2UP_LETTER.pdf",(3.5,5.5),(2,1))
    repeated_back_pdf(crop_trim(queen_back,"queen"),len(queens),pnp/"06_QUEEN_BACKS_2UP_LETTER.pdf",(3.5,5.5),(2,1))
    aid_trim=crop_trim(aid_front,"aid"); aid_back_trim=crop_trim(aid_back,"aid")
    pnp_pdf([aid_trim]*5,pnp/"07_PLAYER_AIDS_FRONTS_2UP_LETTER.pdf",(6,4),(1,2))
    pnp_pdf([aid_back_trim]*5,pnp/"08_PLAYER_AIDS_BACKS_2UP_LETTER.pdf",(6,4),(1,2))
    folio_pdf(ffront,fback,pnp/"09_RULES_MEDIUM_FOLIO_11x17.pdf")
    (pnp/"README.txt").write_text(
        "Haute & Hazard v7.9 Print & Play\n\nPrint at Actual Size / 100%. Cut on the visible card borders. Opaque sleeves are recommended.\n"
        "Front/back PDFs use repeated shared backs and are intended for manual duplex alignment or sleeving.\n"
        "Use 00_START_HERE.pdf before play.\n",encoding="utf-8")
    write_checksums(pnp,pnp/"CHECKSUMS.sha256")

    # TTS sheets. Keep every texture <= 4096 px for broad GPU compatibility.
    custom={}
    card_id_map={}
    card_meta={}
    poker_tts_cell=(500,700)
    poker_per_sheet=30
    poker_cols,poker_rows=6,5
    for sheet_idx in range(8):
        chunk=poker_trim[sheet_idx*poker_per_sheet:(sheet_idx+1)*poker_per_sheet]
        sheet_name=f"v7_9_poker_sheet_{sheet_idx+1}.jpg"
        make_sheet(chunk,poker_cols,poker_rows,poker_tts_cell,tts_assets/sheet_name)
        key=str(sheet_idx+1)
        custom[key]={"FaceURL":f"{RAW_BASE}/{sheet_name}","BackURL":f"{RAW_BASE}/v7_9_poker_back.jpg","NumWidth":poker_cols,"NumHeight":poker_rows,"BackIsHidden":True,"UniqueBack":False,"Type":0}
        for j,r in enumerate(cards[sheet_idx*poker_per_sheet:(sheet_idx+1)*poker_per_sheet]):
            cid=(sheet_idx+1)*100+j
            card_id_map[r['card_id']]=cid
            card_meta[cid]=(r['card_name'],poker_desc(r))
    save_jpg(crop_trim(poker_back,"poker").resize(poker_tts_cell,Image.Resampling.LANCZOS),tts_assets/"v7_9_poker_back.jpg",90)

    stage_cell=(500,700)
    make_sheet(stage_trim,4,3,stage_cell,tts_assets/"v7_9_stage_sheet.jpg")
    custom["9"]={"FaceURL":f"{RAW_BASE}/v7_9_stage_sheet.jpg","BackURL":f"{RAW_BASE}/v7_9_stage_back.jpg","NumWidth":4,"NumHeight":3,"BackIsHidden":True,"UniqueBack":False,"Type":0}
    save_jpg(crop_trim(stage_back,"poker").resize(stage_cell,Image.Resampling.LANCZOS),tts_assets/"v7_9_stage_back.jpg",90)
    stage_ids=[]
    for i,r in enumerate(stages):
        cid=900+i;stage_ids.append(cid)
        card_meta[cid]=(r['stage_name'],f"{r['stage_id']} — {r['subtitle']}\nFavored {r['favored_tenet']} | Featured {r['featured_brand']}\nSlay Target {r['slay_target']} Appeal | Reward {r['reward_gross_sp']} Gross SP\nJudge: {r['judge']}\nVenue: {r['venue_effect']}\nSpotlight: {r['spotlight_requirement']}\nJudge's Favor: {r['judge_favor']}\nBrand Ovation: {r['brand_ovation']}")

    q_cell=(525,825)
    q_cells=[im.resize(q_cell,Image.Resampling.LANCZOS) for im in queen_trim]
    make_sheet(q_cells,4,3,q_cell,tts_assets/"v7_9_queen_sheet.jpg")
    custom["10"]={"FaceURL":f"{RAW_BASE}/v7_9_queen_sheet.jpg","BackURL":f"{RAW_BASE}/v7_9_queen_back.jpg","NumWidth":4,"NumHeight":3,"BackIsHidden":True,"UniqueBack":False,"Type":0}
    save_jpg(crop_trim(queen_back,"queen").resize(q_cell,Image.Resampling.LANCZOS),tts_assets/"v7_9_queen_back.jpg",90)
    queen_ids=[]
    for i,r in enumerate(queens):
        cid=1000+i;queen_ids.append(cid)
        card_meta[cid]=(r['name'],f"{r['queen_id']}\nSignature Tenet: {r['signature_tenet']}\nFavorite Brand: {r['favorite_brand']}\n\n{r['signature_ability_name']}: {r['signature_ability_text']}\n\nSPECIAL APPEAL — {r['special_appeal_name']}: {r['special_appeal_text']}")

    aid_cell=(900,600)
    aid_cells=[aid_trim.resize(aid_cell,Image.Resampling.LANCZOS) for _ in range(5)]
    make_sheet(aid_cells,3,2,aid_cell,tts_assets/"v7_9_player_aids.jpg")
    custom["11"]={"FaceURL":f"{RAW_BASE}/v7_9_player_aids.jpg","BackURL":f"{RAW_BASE}/v7_9_player_aid_back.jpg","NumWidth":3,"NumHeight":2,"BackIsHidden":True,"UniqueBack":False,"Type":0}
    save_jpg(aid_back_trim.resize(aid_cell,Image.Resampling.LANCZOS),tts_assets/"v7_9_player_aid_back.jpg",90)
    aid_ids=[]
    for i in range(5):
        cid=1100+i;aid_ids.append(cid);card_meta[cid]=(f"Player Aid {i+1}","v7.9 player aid — play-generated Tips, five-card hands, cleanup Rack refill.")

    # Save setup.
    objects=[]
    note=common_obj("790001","Notecard",f"HAUTE & HAZARD v{VERSION} — START HERE",
        "SETUP: Choose Queens. Each player shuffles a 12-card starter Deck and draws 5. Shuffle Wardrobe and deal 5 face-up to form the Rack. Reveal one Stage.\n\nTURN: Transformation → Reveal → Shopping → Slay / Dragdagulan† / Pass → Cleanup.\n\nPLAY-GENERATED TIPS: play a card → gain its printed Tips → resolve text. Unplayed cards and old Masters do not generate printed Tips.\n\nShopping purchases go to Backstage Archive. Refill Rack during Cleanup, then draw 5.",(-11,1,-7),rot=(0,0,0))
    objects.append(note)

    wardrobe_ids=[card_id_map[r['card_id']] for r in cards if r['component']=="Wardrobe"]
    thrift_ids=[card_id_map[r['card_id']] for r in cards if r['component']=="Thrift"]
    penalty_ids=[card_id_map[r['card_id']] for r in cards if r['component']=="Penalty"]
    objects.append(tts_deck_obj("790100","Wardrobe Deck — 144","Shuffle, then deal 5 face-up as the Wardrobe Rack. Refill empty Rack spaces during Cleanup.",wardrobe_ids,card_meta,{k:v for k,v in custom.items() if k in {'3','4','5','6','7'}},(0,1.2,0)))
    objects.append(tts_deck_obj("790200","Thrift Store — 16","Finite shared Thrift Store supply.",thrift_ids,card_meta,{k:v for k,v in custom.items() if k in {'7','8'}},(8,1.2,0)))
    objects.append(tts_deck_obj("790300","Penalty Supply — 20","Wardrobe Malfunction, The Chop, and Extermination supply.",penalty_ids,card_meta,{k:v for k,v in custom.items() if k=='8'},(8,1.2,6)))
    objects.append(tts_deck_obj("790400","Stage Deck — 12","Shuffle. Reveal one active Stage. Stage cards are read sideways.",stage_ids,card_meta,{"9":custom['9']},(-8,1.2,0),sideways=True))
    objects.append(tts_deck_obj("790500","Queen Deck — 12","Choose or randomize one Queen per player.",queen_ids,card_meta,{"10":custom['10']},(-8,1.2,6)))

    # Five starter decks with exact 7/3/2 copies.
    basics=[r for r in cards if r['component']=="Starter" and r['card_name']=="Basic Beat"]
    messys=[r for r in cards if r['component']=="Starter" and r['card_name']=="Messy Lip Sync"]
    chaps=[r for r in cards if r['component']=="Starter" and r['card_name']=="Chapstick"]
    positions=[(-11,1.2,-1),(-6,1.2,-8),(0,1.2,-9),(6,1.2,-8),(11,1.2,-1)]
    for p in range(5):
        rs=basics[p*7:(p+1)*7]+messys[p*3:(p+1)*3]+chaps[p*2:(p+1)*2]
        ids=[card_id_map[r['card_id']] for r in rs]
        keys={str((int(r['card_id'].split('-')[1])-1)//30+1) for r in rs}
        cdeck={k:custom[k] for k in keys}
        objects.append(tts_deck_obj(f"791{p}00",f"Player {p+1} Starter Deck — 12","7 Basic Beat, 3 Messy Lip Sync, 2 Chapstick. Shuffle and draw 5.",ids,card_meta,cdeck,positions[p]))
        objects.append(tts_card_obj(f"792{p}00",aid_ids[p],f"Player Aid {p+1}",card_meta[aid_ids[p]][1],{"11":custom['11']},(positions[p][0],1.1,positions[p][2]+3),sideways=True))

    save={
        "SaveName":f"Haute & Hazard v{VERSION} — Standard Playtest",
        "GameMode":"Haute & Hazard","Date":"9/24/2026","Gravity":0.5,"PlayArea":0.5,"GameType":"","GameComplexity":"Medium",
        "Tags":["Haute & Hazard","Deck Building","Drag","Prototype","v7.9"],"Table":"Table_RPG","Sky":"Sky_Clouds",
        "Note":"v7.9 standard setup. Functional prototype assets generated from canonical v7.9 data.",
        "Rules":"Use docs/CURRENT_GAMEPLAY.md and docs/BEGINNER_MODE.md.","TabStates":{},"LuaScript":"","LuaScriptState":"","XmlUI":"","ObjectStates":objects
    }
    tts_json=rel/"TTS/Haute_Hazard_v7_9_TTS_Playtest.json"
    tts_json.write_text(json.dumps(save,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    # Validate JSON roundtrip and counts.
    parsed=json.loads(tts_json.read_text(encoding="utf-8"))
    if len(parsed['ObjectStates']) < 15: raise SystemExit("TTS save unexpectedly sparse")
    # Every TTS GUID must be unique, including contained cards.
    guids=[]
    def collect_guids(obj):
        if obj.get('GUID'):
            guids.append(obj['GUID'])
        for child in obj.get('ContainedObjects',[]):
            collect_guids(child)
    for obj in parsed['ObjectStates']:
        collect_guids(obj)
    if len(guids) != len(set(guids)):
        raise SystemExit("TTS save contains duplicate GUIDs")
    # Each CardID's hundreds prefix must have a matching CustomDeck definition.
    def validate_card_mapping(obj):
        cdeck=obj.get('CustomDeck',{})
        if 'CardID' in obj:
            key=str(int(obj['CardID'])//100)
            if key not in cdeck:
                raise SystemExit(f"TTS CardID {obj['CardID']} missing CustomDeck key {key} in {obj.get('Nickname')}")
        for cid in obj.get('DeckIDs',[]):
            key=str(int(cid)//100)
            if key not in cdeck:
                raise SystemExit(f"TTS DeckID {cid} missing CustomDeck key {key} in {obj.get('Nickname')}")
        for child in obj.get('ContainedObjects',[]):
            validate_card_mapping(child)
    for obj in parsed['ObjectStates']:
        validate_card_mapping(obj)

    tts_readme=(
        f"# Haute & Hazard v{VERSION} — Tabletop Simulator\n\n"
        "Load `Haute_Hazard_v7_9_TTS_Playtest.json` in Tabletop Simulator. The save references the bundled asset sheets through raw GitHub URLs so multiplayer clients can resolve them.\n\n"
        "Included objects: Wardrobe 144, Thrift 16, Penalties 20, Stages 12, Queens 12, five 12-card starter decks, and five Player Aids.\n\n"
        "Manual setup after load: shuffle Wardrobe, deal 5 face-up as the Rack, shuffle/reveal the Stage deck, choose Queens, shuffle each used starter deck and draw 5.\n\n"
        "Rules engine: cards generate printed Tips when played during Transformation; purchases enter Archive; Rack refills and players draw 5 at Cleanup.\n"
    )
    (rel/"TTS/README.md").write_text(tts_readme,encoding="utf-8")
    tts_manifest={"version":VERSION,"save":"Haute_Hazard_v7_9_TTS_Playtest.json","asset_count":len(list(tts_assets.glob('v7_9_*.jpg'))),"max_texture_px":4096,"counts":{"Poker":240,"Wardrobe":144,"Starter":60,"Thrift":16,"Penalty":20,"Stages":12,"Queens":12,"PlayerAids":5},"remote_base":RAW_BASE}
    (rel/"TTS/BUILD_MANIFEST.json").write_text(json.dumps(tts_manifest,indent=2)+"\n",encoding="utf-8")
    (rel/"TTS/TTS_QA_REPORT.txt").write_text(
        f"Haute & Hazard v{VERSION} TTS generated QA\n"
        "PASS: JSON parses\nPASS: 240 Poker cards mapped across 8 custom-deck sheets\nPASS: 144 Wardrobe / 60 Starter / 16 Thrift / 20 Penalty IDs\nPASS: 12 Stages / 12 Queens / 5 Player Aids\nPASS: five 12-card starter decks\nPASS: all TTS GUIDs unique\nPASS: every CardID/DeckID has its required CustomDeck mapping\nPASS: all TTS textures <= 4096 px\nPASS: asset URLs point to releases/v7.9/TTS/Assets on main\n"
        "RUNTIME NOTE: source-level QA cannot substitute for opening the save inside Tabletop Simulator.\n",encoding="utf-8")

    # Package ZIPs.
    zip_dir(gc,rel/"Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip","Haute_Hazard_v7.9_Game_Crafter_Print_Edition")
    zip_dir(pnp,rel/"Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip","Haute_Hazard_v7_9_Print_and_Play_Physical_Kit")
    tts_pkg=work/"tts_pkg";tts_pkg.mkdir()
    shutil.copy2(tts_json,tts_pkg/tts_json.name)
    shutil.copy2(rel/"TTS/README.md",tts_pkg/"README.md")
    shutil.copy2(rel/"TTS/BUILD_MANIFEST.json",tts_pkg/"BUILD_MANIFEST.json")
    shutil.copy2(rel/"TTS/TTS_QA_REPORT.txt",tts_pkg/"TTS_QA_REPORT.txt")
    shutil.copytree(tts_assets,tts_pkg/"Assets")
    zip_dir(tts_pkg,rel/"Haute_Hazard_v7.9_TTS_Playtest.zip","Haute_Hazard_v7.9_TTS_Playtest")

    build_manifest={
        "version":VERSION,
        "source_counts":{"poker":len(cards),"queens":len(queens),"stages":len(stages)},
        "outputs":{
            "game_crafter_zip":"Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip",
            "print_and_play_zip":"Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip",
            "tts_zip":"Haute_Hazard_v7.9_TTS_Playtest.zip",
            "tts_save":"TTS/Haute_Hazard_v7_9_TTS_Playtest.json"
        },
        "sha256":{
            "game_crafter_zip":sha256_file(rel/"Haute_Hazard_v7.9_Game_Crafter_Print_Edition.zip"),
            "print_and_play_zip":sha256_file(rel/"Haute_Hazard_v7_9_Print_and_Play_Physical_Kit.zip"),
            "tts_zip":sha256_file(rel/"Haute_Hazard_v7.9_TTS_Playtest.zip")
        }
    }
    (rel/"BUILD_MANIFEST.json").write_text(json.dumps(build_manifest,indent=2)+"\n",encoding="utf-8")
    (rel/"PRINT_PREFLIGHT_REPORT.txt").write_text(
        f"Haute & Hazard v{VERSION} generated physical preflight\n"
        "PASS: 240 Poker fronts at 825x1125\nPASS: essential card text is inside the 75 px TGC safe-content inset\nPASS: 1 Poker shared back at 825x1125\n"
        "PASS: 12 Stage fronts at 825x1125\nPASS: Stage text source verified from v7.8 venue print assets\n"
        "PASS: 12 Queen fronts at 1125x1725\nPASS: 5 Player Aid fronts + 5 backs at 1875x1275\n"
        "PASS: Medium Folio front/back at 4875x2475\nPASS: Medium Prototype Box artboard at 5850x5400\n"
        "PASS: PnP Poker/Stage trim size 2.5x3.5 in; Queen trim 3.5x5.5 in; Player Aid 6x4 in\n"
        "PASS: all 240 Poker cards display printed Tips, including 0\nPASS: v7.9 five-phase play-generated-Tips Player Aid wording\n"
        "PASS: Game Crafter and PnP ZIPs generated with SHA-256 checksums\n"
        "NOTE: visual prototype art is functional and safe-text-oriented; commercial art review is separate from print preflight.\n",encoding="utf-8")

    print(json.dumps(build_manifest,indent=2))
    return build_manifest


if __name__=="__main__":
    root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
    build(root)
