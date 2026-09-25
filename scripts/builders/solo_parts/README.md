# Solo Circuit v0.2 builder bootstrap

The Solo Circuit v0.2 generator is currently stored as four ordered Base64 fragments:

- `part1.b64`
- `part2.b64`
- `part3.b64`
- `part4.b64`

The fragments form one gzip-compressed Python build script when concatenated in numeric order.

The canonical CI/publish command is:

```bash
cat scripts/builders/solo_parts/part{1,2,3,4}.b64 | tr -d '\n\r' | base64 -d | gzip -d > /tmp/build_solo_v0_2_assets.py
python /tmp/build_solo_v0_2_assets.py
```

Do not reorder, independently edit, or relabel the fragments. The combined v7.9 build workflow verifies that they generate the expected 18 Automa, 12 Personality, Print & Play, and TTS outputs.

The readable base-game builder is `scripts/build_v7_9_assets.py`.
