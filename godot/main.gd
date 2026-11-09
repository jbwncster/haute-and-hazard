extends Control

const CORE_SLOTS := ["Face", "Wig", "Body", "Shoes"]
const ALL_SLOTS := ["Face", "Wig", "Body", "Shoes", "Accessory"]
const TENETS := ["Pink", "Blue", "Purple", "Yellow"]
const DATA_PATH := "res://data.json"

var data: Dictionary = {}
var game: Dictionary = {}
var serial := 0
var root_box: VBoxContainer
var menu_fields: Array[LineEdit] = []
var log_lines: Array[String] = []

func _ready() -> void:
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(DATA_PATH))
	if parsed is Dictionary:
		data = parsed
	show_menu()

func _clear() -> void:
	for child in get_children():
		remove_child(child)
		child.queue_free()
	root_box = VBoxContainer.new()
	root_box.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root_box.add_theme_constant_override("separation", 12)
	add_child(root_box)

func _scroll() -> VBoxContainer:
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	root_box.add_child(scroll)
	var content := VBoxContainer.new()
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_theme_constant_override("separation", 10)
	scroll.add_child(content)
	return content

func _label(parent: Control, text: String, size := 18, color := Color(0.94, 0.91, 0.98)) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	parent.add_child(label)
	return label

func _button(parent: Control, text: String, callback: Callable, min_height := 48) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(0, min_height)
	button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	button.add_theme_font_size_override("font_size", 17)
	button.pressed.connect(callback)
	parent.add_child(button)
	return button

func _row(parent: Control) -> HBoxContainer:
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 8)
	row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	parent.add_child(row)
	return row

func show_menu() -> void:
	_clear()
	_label(root_box, "HAUTE & HAZARD", 36, Color("#f4ca62"))
	_label(root_box, "Build a Look. Slay the Stage. Survive the House.", 18, Color("#ed79bb"))
	var body := _scroll()
	_label(body, "Choose your game", 24)
	var mode := OptionButton.new()
	mode.add_item("Solo vs The House", 0)
	mode.add_item("Pass and Play — 2 to 5 players", 1)
	mode.custom_minimum_size.y = 46
	body.add_child(mode)
	var count_row := _row(body)
	_label(count_row, "Players (pass-and-play)", 17)
	var count := OptionButton.new()
	for i in range(2, 6):
		count.add_item(str(i), i)
	count.select(0)
	count.custom_minimum_size = Vector2(130, 42)
	count_row.add_child(count)
	var diff_row := _row(body)
	_label(diff_row, "House difficulty", 17)
	var difficulty := OptionButton.new()
	for item in ["Local Girl", "Working Queen", "Headliner", "Legend"]:
		difficulty.add_item(item)
	difficulty.select(1)
	difficulty.custom_minimum_size = Vector2(210, 42)
	diff_row.add_child(difficulty)
	_label(body, "Player names", 20)
	menu_fields.clear()
	for i in range(5):
		var field := LineEdit.new()
		field.placeholder_text = "Player %d" % (i + 1)
		field.text = "Player %d" % (i + 1)
		field.custom_minimum_size.y = 42
		body.add_child(field)
		menu_fields.append(field)
	_label(body, "Your Queen", 20)
	var queen_picker := OptionButton.new()
	for i in range(data.get("queens", []).size()):
		var queen: Dictionary = data.queens[i]
		queen_picker.add_item("%s — %s" % [queen.name, queen.tenet], i)
	queen_picker.custom_minimum_size.y = 44
	body.add_child(queen_picker)
	_label(body, "Solo uses the full v7.9 Stage and House card data. In pass-and-play, players take turns on one device.", 16, Color("#b9aec8"))
	_button(root_box, "Start Game", func(): _start_game(mode.selected, count.get_item_id(count.selected), difficulty.selected, queen_picker.selected), 58)
	mode.item_selected.connect(func(index: int): count_row.visible = index == 1)
	count_row.visible = false

func _card_by_name(card_name: String) -> Dictionary:
	for card in data.get("cards", []):
		if card.name == card_name:
			return card
	return {}

func _instance(card: Dictionary) -> Dictionary:
	serial += 1
	var result := card.duplicate(true)
	result["instance"] = serial
	return result

func _shuffle(list: Array) -> Array:
	list.shuffle()
	return list

func _starter_deck() -> Array:
	var deck: Array = []
	for card_name in ["Basic Beat", "Basic Beat", "Basic Beat", "Basic Beat", "Basic Beat", "Basic Beat", "Basic Beat", "Messy Lip Sync", "Messy Lip Sync", "Messy Lip Sync", "Chapstick", "Chapstick"]:
		deck.append(_instance(_card_by_name(card_name)))
	return _shuffle(deck)

func _new_player(player_name: String, queen: Dictionary) -> Dictionary:
	var player := {
		"name": player_name, "queen": queen, "deck": _starter_deck(), "archive": [], "hand": [],
		"played": [], "trash": [], "masters": {"Face": null, "Wig": null, "Body": null, "Shoes": null, "Accessory": null},
		"tips": 0, "appeal": 0, "gross_sp": 0, "trophies": 0, "look": {}, "spotlight": true,
		"newest_slot": "", "play_count": 0
	}
	_draw_cards(player, 5)
	return player

func _draw_cards(player: Dictionary, amount: int) -> void:
	for _i in range(amount):
		if player.deck.is_empty() and not player.archive.is_empty():
			player.deck = _shuffle(player.archive)
			player.archive = []
		if player.deck.is_empty():
			return
		player.hand.append(player.deck.pop_front())

func _start_game(mode_index: int, player_count: int, diff_index: int, queen_index: int) -> void:
	var queens: Array = data.queens
	var start_queen: Dictionary = queens[queen_index]
	var players: Array = []
	var actual_count := 1 if mode_index == 0 else player_count
	for i in range(actual_count):
		var queen: Dictionary = queens[(queen_index + i) % queens.size()]
		var name := menu_fields[i].text.strip_edges()
		if name.is_empty():
			name = "Player %d" % (i + 1)
		players.append(_new_player(name, queen))
	var wardrobe: Array = []
	for card in data.cards:
		if card.component == "Wardrobe":
			wardrobe.append(_instance(card))
	var stages: Array = data.stages.duplicate(true)
	var difficulty_values := [-2, 0, 1, 2]
	game = {
		"mode": "solo" if mode_index == 0 else "multi", "players": players, "current": 0,
		"stage_deck": _shuffle(stages), "active_stage": {}, "rack": [], "wardrobe_deck": [],
		"thrift": [], "phase": "transformation", "stage_round": 1, "difficulty": difficulty_values[diff_index],
		"gross_house": 0, "house_trophies": 0, "house_deck": _shuffle(data.automa.duplicate(true)),
		"house_discard": [], "house_current": {}, "house_removed": {}, "house_wardrobe": [], "house_score": 0,
		"log": [], "round_scores": [], "round_spotlights": [], "purchases": 0, "bargain_tokens": 0,
		"final": false, "queen": start_queen
	}
	log_lines = []
	for _i in range(actual_count):
		game.round_scores.append(0)
		game.round_spotlights.append(false)
	game.wardrobe_deck = _shuffle(wardrobe)
	for i in range(5):
		game.rack.append(game.wardrobe_deck.pop_front())
	for card in data.cards:
		if card.component == "Thrift":
			game.thrift.append(_instance(card))
	_shuffle(game.thrift)
	game.active_stage = game.stage_deck.pop_front()
	if game.mode == "solo":
		_reveal_house()
	_add_log("%s opens %s." % [players[0].name, game.active_stage.name])
	_render_game()

func _add_log(line: String) -> void:
	log_lines.push_front(line)
	if log_lines.size() > 24:
		log_lines.pop_back()

func _refill_rack() -> void:
	for i in range(game.rack.size()):
		if game.rack[i] == null and not game.wardrobe_deck.is_empty():
			game.rack[i] = game.wardrobe_deck.pop_front()

func _reveal_house() -> void:
	if game.house_deck.is_empty():
		game.house_deck = _shuffle(game.house_discard)
		game.house_discard = []
	game.house_current = game.house_deck.pop_front() if not game.house_deck.is_empty() else data.automa[0]
	var candidates: Array = []
	for i in range(game.rack.size()):
		if game.rack[i] != null:
			candidates.append({"card": game.rack[i], "index": i})
	var chosen: Dictionary = {}
	if not candidates.is_empty():
		chosen = _choose_house_card(candidates, str(game.house_current.get("remove", "leftmost")))
		game.house_removed = chosen.card
		game.rack[chosen.index] = null
		game.house_wardrobe.append(game.house_removed)
	else:
		game.house_removed = {}
	_refill_rack()
	if game.house_current.name == "Sample Sale Snatch" and not game.house_removed.is_empty() and int(game.house_removed.cost) <= 2:
		game.bargain_tokens += 1
		if game.bargain_tokens >= 2:
			game.gross_house += 1
			game.bargain_tokens = 0
	game.house_score = _house_appeal()
	_add_log("House reveals %s%s." % [game.house_current.name, " and drafts " + game.house_removed.name if not game.house_removed.is_empty() else ""])

func _choose_house_card(candidates: Array, rule: String) -> Dictionary:
	var wanted_slot := ""
	for slot in CORE_SLOTS:
		var filled := false
		for item in game.house_wardrobe:
			if item.slot == slot:
				filled = true
		if not filled:
			wanted_slot = slot
			break
	var best: Dictionary = candidates[0]
	for item in candidates:
		var card: Dictionary = item.card
		var candidate: Dictionary = best.card
		var choose := false
		match rule:
			"rightmost": choose = item.index > best.index
			"highestCost": choose = int(card.cost) > int(candidate.cost)
			"lowestCost": choose = int(card.cost) < int(candidate.cost)
			"highestAppeal": choose = int(card.appeal) > int(candidate.appeal)
			"highestTips": choose = int(card.tips) > int(candidate.tips)
			"highestLS": choose = int(card.ls) > int(candidate.ls)
			"lowestLS": choose = int(card.ls) < int(candidate.ls)
			"featuredBrand": choose = card.brand == game.active_stage.brand and candidate.brand != game.active_stage.brand
			"signatureTenet": choose = card.tenet == game.players[0].queen.tenet and candidate.tenet != game.players[0].queen.tenet
			"missingSlot": choose = card.slot == wanted_slot and candidate.slot != wanted_slot
			"cost4plusRight": choose = (int(card.cost) >= 4 and int(candidate.cost) < 4) or (int(card.cost) >= 4 and int(candidate.cost) >= 4 and item.index > best.index)
			"newestMasterSlot": choose = card.slot == game.players[0].newest_slot and candidate.slot != game.players[0].newest_slot
			_: choose = item.index < best.index
		if choose:
			best = item
	return best

func _house_appeal() -> int:
	var stage: Dictionary = game.active_stage
	var automa: Dictionary = game.house_current
	var score := maxi(0, int(stage.target) - 6) + int(automa.appeal) + int(game.difficulty)
	if ["Front Row Favorite", "Brand Obsession"].has(automa.name) and not game.house_removed.is_empty() and game.house_removed.brand == stage.brand:
		score += 1
	if automa.name == "Complete the Look":
		var slots: Dictionary = {}
		for card in game.house_wardrobe:
			if CORE_SLOTS.has(card.slot): slots[card.slot] = true
		if slots.size() >= 4: score += 1
	if automa.name == "Standing Ovation" and game.house_trophies > 0: score += 1
	if automa.name == "Camera Loves Her" and game.stage_round >= 2: score += 1
	if automa.name == "Final Chorus" and game.stage_round == 4: score += 1
	if automa.name == "Read to Filth": score -= 1
	return maxi(0, score)

func _master_cards(player: Dictionary) -> Array:
	var result: Array = []
	for slot in ALL_SLOTS:
		if player.masters[slot] != null:
			result.append(player.masters[slot])
	return result

func _resolve_simple_text(player: Dictionary, card: Dictionary, trigger: String) -> void:
	var text := str(card.get("text", ""))
	if text.to_lower().contains("no additional effect"):
		return
	var trigger_regex := RegEx.new()
	trigger_regex.compile("(?i)^(?:%s:|Vogue\\s+[—-])" % trigger)
	if not trigger_regex.search(text):
		return
	var appeal_regex := RegEx.new()
	appeal_regex.compile("(?i)gain\\s+(\\d+)\\s+appeal")
	var appeal_match = appeal_regex.search(text)
	if appeal_match:
		player.appeal += int(appeal_match.get_string(1))
	var tip_regex := RegEx.new()
	tip_regex.compile("(?i)gain\\s+(\\d+)\\s+tips?")
	var tip_match = tip_regex.search(text)
	if tip_match:
		player.tips += int(tip_match.get_string(1))
	var draw_regex := RegEx.new()
	draw_regex.compile("(?i)draw\\s+(\\d+)\\s+cards?")
	var draw_match = draw_regex.search(text)
	if draw_match:
		_draw_cards(player, int(draw_match.get_string(1)))
	var needs_manual := text.contains("if ") or text.contains("If ") or text.contains("archive") or text.contains("Archive") or text.contains("trash") or text.contains("Trash") or text.contains("choose") or text.contains("Choose") or text.contains("opponent") or text.contains("Opponent") or text.contains("maximum")
	if needs_manual or (not appeal_match and not tip_match and not draw_match and not text.to_lower().contains("you may equip")):
		_add_log("Resolve card text manually: %s — %s" % [card.name, text])

func _play_card(index: int, equip: bool) -> void:
	if game.phase != "transformation": return
	var player: Dictionary = game.players[game.current]
	if index < 0 or index >= player.hand.size(): return
	var card: Dictionary = player.hand.pop_at(index)
	player.tips += int(card.tips)
	player.play_count += 1
	if equip and card.type == "Fashion" and card.slot != "none":
		var slot := str(card.slot)
		if player.masters[slot] != null:
			player.archive.append(player.masters[slot])
		player.masters[slot] = card
		player.newest_slot = slot
		_resolve_simple_text(player, card, "Equip")
		_add_log("%s equips %s as %s." % [player.name, card.name, slot])
	else:
		player.played.append(card)
		_resolve_simple_text(player, card, "Play")
		if str(card.text).begins_with("Vogue"):
			_resolve_simple_text(player, card, "Vogue")
		_add_log("%s plays %s for %d Tips." % [player.name, card.name, int(card.tips)])
	_render_game()

func _spotlight_met(player: Dictionary, stage: Dictionary) -> bool:
	var text := str(stage.spotlight)
	var masters := _master_cards(player)
	if text.contains("Accessory equipped"): return player.masters.Accessory != null
	if text.contains("Pink Shoes Master"): return player.masters.Shoes != null and player.masters.Shoes.tenet == "Pink"
	if text.contains("Blue Body or Wig Master"):
		return (player.masters.Body != null and player.masters.Body.tenet == "Blue") or (player.masters.Wig != null and player.masters.Wig.tenet == "Blue")
	if text.contains("Swamp Witch Master"): return masters.any(func(c): return c.brand == "Swamp Witch")
	if text.contains("Thrift Store card equipped"): return masters.any(func(c): return c.component == "Thrift")
	if text.contains("Blue Body Master"): return player.masters.Body != null and player.masters.Body.tenet == "Blue"
	if text.contains("Velvet Trap Face or Wig Master"):
		return (player.masters.Face != null and player.masters.Face.brand == "Velvet Trap") or (player.masters.Wig != null and player.masters.Wig.brand == "Velvet Trap")
	if text.contains("at least 2 Slasher Masters"): return masters.filter(func(c): return c.brand == "Slasher").size() >= 2
	if text.contains("at least 2 Sugar Rush Masters"): return masters.filter(func(c): return c.brand == "Sugar Rush").size() >= 2
	if text.contains("Big Top Face or Wig Master"):
		return (player.masters.Face != null and player.masters.Face.brand == "Big Top") or (player.masters.Wig != null and player.masters.Wig.brand == "Big Top")
	if text.contains("all four core slots occupied"): return CORE_SLOTS.all(func(slot): return player.masters[slot] != null and player.masters[slot].tenet != "Neutral")
	if text.contains("at least 2 Hyper-Glitch Masters"): return masters.filter(func(c): return c.brand == "Hyper-Glitch").size() >= 2
	return false

func _reveal() -> void:
	if game.phase != "transformation": return
	var player: Dictionary = game.players[game.current]
	var stage: Dictionary = game.active_stage
	var core: Array = []
	for slot in CORE_SLOTS:
		core.append(player.masters[slot])
	var complete := core.all(func(card): return card != null)
	var tenets: Array[String] = []
	for card in core:
		if card != null and card.tenet not in ["Neutral", "None"]: tenets.append(str(card.tenet))
	var matching: bool = complete and tenets.size() == 4 and tenets.all(func(t): return t == tenets[0])
	var perfect: bool = matching and tenets[0] == player.queen.tenet
	var appeal := int(player.appeal)
	for card in _master_cards(player): appeal += int(card.appeal)
	match stage.id:
		"STG-01": if player.masters.Accessory != null: appeal += 1
		"STG-02": if player.masters.Shoes != null and player.masters.Shoes.brand == "Hyper-Glitch": appeal += 1
		"STG-04": appeal += _master_cards(player).filter(func(c): return c.tenet == "Yellow").size()
		"STG-05": appeal += _master_cards(player).filter(func(c): return c.component == "Thrift" or c.tenet == "Neutral").size()
		"STG-06": if player.masters.Body != null and player.masters.Body.tenet == "Blue": appeal += 2
		"STG-10": appeal += _master_cards(player).filter(func(c): return c.brand == "Big Top").size()
		"STG-11": appeal += _master_cards(player).filter(func(c): return c.brand == "Gilded Cage").size()
	var multiplier := 3 if perfect else (2 if matching else 1)
	player.look = {"complete": complete, "matching": matching, "perfect": perfect, "appeal": appeal, "total": appeal * multiplier}
	player.spotlight = _spotlight_met(player, stage)
	if stage.id == "STG-07" and (player.masters.Face != null or player.masters.Wig != null):
		player.look.total += 2
	if stage.id == "STG-09": player.tips += _master_cards(player).filter(func(c): return c.brand == "Sugar Rush").size()
	game.phase = "shopping"
	game.round_scores[game.current] = player.look.total
	game.round_spotlights[game.current] = player.spotlight
	if stage.id == "STG-03" and ((player.masters.Body != null and player.masters.Body.tenet == "Blue") or (player.masters.Wig != null and player.masters.Wig.tenet == "Blue")):
		_add_log("Haunted Hotel Wild assignment: resolve the Blue Master Tenet choice manually.")
	for card in _master_cards(player) + player.played:
		if str(card.text).begins_with("Reveal:") or str(card.text).begins_with("Matching:") or str(card.text).begins_with("Fusion:"):
			_add_log("Resolve triggered card text manually: %s — %s" % [card.name, card.text])
	if not str(player.queen.get("ability", "")).is_empty():
		_add_log("Queen ability reminder: %s — %s" % [player.queen.abilityName, player.queen.ability])
	_add_log("Reveal: %d Appeal%s (target %d)." % [player.look.total, " — Spotlight missing" if not player.spotlight else "", stage.target])
	_render_game()

func _buy(index: int, thrift: bool) -> void:
	if game.phase != "shopping": return
	var player: Dictionary = game.players[game.current]
	var source: Array = game.thrift if thrift else game.rack
	if index < 0 or index >= source.size() or source[index] == null: return
	var card: Dictionary = source[index]
	var cost := int(card.cost)
	if game.mode == "solo" and game.stage_round == 1 and game.house_current.name == "Sold Out" and int(game.purchases) == 0: cost += 1
	if game.mode == "solo" and game.house_current.name == "VIP Rope" and int(game.purchases) >= 1: return
	if int(player.tips) < cost: return
	player.tips -= cost
	player.archive.append(card)
	if thrift:
		source.remove_at(index)
	else:
		source[index] = null
	game.purchases += 1
	_add_log("%s buys %s for %d Tips." % [player.name, card.name, cost])
	_render_game()

func _can_slay(player: Dictionary) -> bool:
	return not player.look.is_empty() and int(player.look.total) >= int(game.active_stage.target) and player.spotlight

func _end_shopping() -> void:
	if game.phase != "shopping": return
	game.phase = "stage"
	_render_game()

func _cleanup_player(player: Dictionary) -> void:
	if player.masters.Accessory != null:
		player.archive.append(player.masters.Accessory)
		player.masters.Accessory = null
	player.archive.append_array(player.played)
	player.archive.append_array(player.hand)
	player.played = []
	player.hand = []
	player.tips = 0
	player.appeal = 0
	player.look = {}
	player.spotlight = true
	player.play_count = 0
	_draw_cards(player, 5)

func _pass_turn() -> void:
	if game.mode == "solo":
		var player: Dictionary = game.players[0]
		var house_score := int(game.house_score)
		_add_log("House Appeal: %d vs target %d." % [house_score, int(game.active_stage.target)])
		if house_score < int(game.active_stage.target) and game.stage_round < 4 and game.house_current.name == "House Always Wins":
			game.gross_house += 1
		_cleanup_player(player)
		game.house_discard.append(game.house_current)
		if house_score >= int(game.active_stage.target) or game.stage_round >= 4:
			_claim_house()
		else:
			game.stage_round += 1
			game.purchases = 0
			game.phase = "transformation"
			_reveal_house()
			_render_game()
		return
	var player_index: int = game.current
	_cleanup_player(game.players[player_index])
	if player_index < game.players.size() - 1:
		game.current += 1
		game.phase = "transformation"
		_render_game()
		return
	game.current = 0
	if game.stage_round >= 4:
		var winner_index := 0
		for i in range(1, game.players.size()):
			if int(game.round_scores[i]) > int(game.round_scores[winner_index]):
				winner_index = i
		if int(game.round_scores[winner_index]) >= int(game.active_stage.target) and game.round_spotlights[winner_index]:
			_claim_stage(winner_index)
		else:
			_add_log("The Stage closes without a Slay; the circuit moves on.")
			_finish_stage(-1)
	else:
		game.stage_round += 1
		for i in range(game.players.size()):
			game.round_scores[i] = 0
			game.round_spotlights[i] = false
		game.phase = "transformation"
		_render_game()

func _claim_stage(player_index: int) -> void:
	var stage: Dictionary = game.active_stage
	var player: Dictionary = game.players[player_index]
	var gain := int(stage.reward)
	if player.spotlight: gain += 1
	var brand_count := 0
	for slot in CORE_SLOTS:
		if player.masters[slot] != null and player.masters[slot].brand == stage.brand: brand_count += 1
	if brand_count == 4: gain += 2
	player.gross_sp += gain
	player.trophies += 1
	_add_log("%s Slays %s for %d Gross SP." % [player.name, stage.name, gain])
	_finish_stage(player_index)

func _claim_house() -> void:
	var stage: Dictionary = game.active_stage
	var gain := int(stage.reward)
	game.gross_house += gain
	game.house_trophies += 1
	_add_log("The House claims %s for %d Gross SP." % [stage.name, gain])
	_finish_stage(-1)

func _finish_stage(winner: int) -> void:
	for player in game.players:
		for slot in ALL_SLOTS:
			if player.masters[slot] != null:
				player.archive.append(player.masters[slot])
				player.masters[slot] = null
		if player.hand.size() > 0 or player.played.size() > 0 or player_index_is_current(player):
			_cleanup_player(player)
		if winner < 0 or player != game.players[winner]:
			player.look = {}
	if game.mode == "solo" and not game.house_current.is_empty():
		game.house_discard.append(game.house_current)
	var done: bool = game.stage_deck.is_empty()
	for player in game.players:
		if int(player.gross_sp) >= 30: done = true
	if done:
		game.final = true
		game.phase = "finished"
		_render_game()
		return
	game.active_stage = game.stage_deck.pop_front()
	game.stage_round = 1
	game.purchases = 0
	for i in range(game.players.size()):
		game.round_scores[i] = 0
		game.round_spotlights[i] = false
	game.current = 0 if game.mode == "solo" else (maxi(0, winner + 1) % game.players.size())
	game.phase = "transformation"
	_refill_rack()
	if game.mode == "solo": _reveal_house()
	_add_log("Curtain Call. New Stage: %s." % game.active_stage.name)
	_render_game()

func player_index_is_current(player: Dictionary) -> bool:
	return player == game.players[game.current]

func _player_final_score(player: Dictionary) -> int:
	var score := int(player.gross_sp)
	for collection in [player.deck, player.archive, player.hand, player.played, player.trash, _master_cards(player)]:
		for card in collection:
			if card.component == "Penalty": score -= 2 if card.name == "Extermination" else 1
	return score

func _render_game() -> void:
	_clear()
	var title_row := _row(root_box)
	_label(title_row, "HAUTE & HAZARD", 26, Color("#f4ca62"))
	_button(title_row, "Main Menu", show_menu, 42)
	if game.final:
		_render_final()
		return
	var content := _scroll()
	var stage: Dictionary = game.active_stage
	var player: Dictionary = game.players[game.current]
	_label(content, "%s  •  Stage %d / 12  •  Circuit Round %d" % [stage.name, 13 - game.stage_deck.size(), game.stage_round], 25, Color("#f4ca62"))
	_label(content, "Target %d Appeal  |  Reward %d SP  |  Featured Brand: %s" % [stage.target, stage.reward, stage.brand], 17)
	_label(content, "Spotlight: %s" % stage.spotlight, 15, Color("#b9aec8"))
	if game.mode == "solo":
		_label(content, "House: %s — Appeal %d  |  House SP %d" % [game.house_current.name, game.house_score, game.gross_house], 18, Color("#ed79bb"))
		if not game.house_removed.is_empty(): _label(content, "House drafted: %s" % game.house_removed.name, 15, Color("#b9aec8"))
	_label(content, "%s as %s (%s)   •   Gross SP %d   •   Trophies %d   •   Tips %d" % [player.name, player.queen.name, player.queen.tenet, player.gross_sp, player.trophies, player.tips], 19)
	var master_row := _row(content)
	for slot in ALL_SLOTS:
		var card = player.masters[slot]
		_label(master_row, "%s: %s" % [slot, card.name if card != null else "—"], 14, Color("#b9aec8"))
	if game.phase == "transformation":
		_label(content, "TRANSFORMATION — Play cards for Tips, or equip Fashion as a Master.", 20)
		for i in range(player.hand.size()):
			var card: Dictionary = player.hand[i]
			var row := _row(content)
			_label(row, "%s  |  %s • %s • Cost %d • Tips %d • Appeal %d\n%s" % [card.name, card.type, card.slot, card.cost, card.tips, card.appeal, card.text], 15)
			_button(row, "Play", _play_card.bind(i, false), 56)
			if card.type == "Fashion" and card.slot != "none":
				_button(row, "Equip", _play_card.bind(i, true), 56)
		_button(content, "Reveal Look", _reveal, 52)
	elif game.phase == "shopping":
		var look: Dictionary = player.look
		_label(content, "THE REVEAL — %d Appeal (×%d = %d). %s" % [look.appeal, 3 if look.perfect else (2 if look.matching else 1), look.total, "Spotlight met" if player.spotlight else "Spotlight not met"], 20, Color("#ed79bb"))
		_label(content, "SHOPPING — Spend Tips to add Fashion to your Archive.", 20)
		for i in range(game.rack.size()):
			var card = game.rack[i]
			if card != null:
				var buy_button := _button(content, "Rack: %s — %s %s | cost %d | +%d Appeal\n%s" % [card.name, card.slot, card.tenet, card.cost, card.appeal, card.text], _buy.bind(i, false), 58)
				buy_button.disabled = int(player.tips) < int(card.cost)
		if not game.thrift.is_empty():
			var thrift_card = game.thrift[0]
			if thrift_card != null:
				var thrift_button := _button(content, "Thrift: %s — %s | cost %d" % [thrift_card.name, thrift_card.slot, thrift_card.cost], _buy.bind(0, true), 48)
				thrift_button.disabled = int(player.tips) < int(thrift_card.cost)
		_button(content, "Finish Shopping", _end_shopping, 48)
	else:
		_label(content, "SLAY / PASS — %d Appeal against target %d." % [player.look.get("total", 0), stage.target], 20)
		if _can_slay(player):
			_button(content, "Slay %s (+%d SP)" % [stage.name, stage.reward], _claim_stage.bind(game.current), 56)
		else:
			_label(content, "You need the Stage target and its Spotlight requirement to Slay.", 16, Color("#ed8888"))
		_button(content, "Pass to The House" if game.mode == "solo" else "Pass Turn", _pass_turn, 52)
	_label(content, "Wardrobe Rack", 20, Color("#f4ca62"))
	for card in game.rack:
		_label(content, "• %s — %s / %s — cost %d, +%d Appeal" % [card.name, card.slot, card.tenet, card.cost, card.appeal] if card != null else "• Empty slot", 15)
	_label(content, "Recent action", 20, Color("#f4ca62"))
	for line in log_lines.slice(0, 8): _label(content, "• " + line, 14, Color("#b9aec8"))

func _render_final() -> void:
	var content := _scroll()
	_label(content, "FINAL JUDGING", 32, Color("#f4ca62"))
	for player in game.players:
		_label(content, "%s — %s Gross SP, %s final SP, %s trophies" % [player.name, player.gross_sp, _player_final_score(player), player.trophies], 22)
	if game.mode == "solo":
		_label(content, "The House — %s Gross SP, %s final SP, %s trophies" % [game.gross_house, game.gross_house, game.house_trophies], 22, Color("#ed79bb"))
	_label(content, "Thanks for playing. The shipped v7.9 card set is included in this project.", 16, Color("#b9aec8"))
	_button(root_box, "Play Again", show_menu, 56)
