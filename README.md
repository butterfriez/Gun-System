# Gun System

A minimal, framework-agnostic gun system with server-authoritative damage and client-side visuals.  
Designed to be simple, readable, and easy to extend.

## Features

- Configurable weapon stats
- Server-validated firing and damage
- Client-side input and effects
- Basic fire-rate protection
- Hitscan raycasting

## Usage

1. Define weapon stats in a shared config.
2. Client sends fire requests with origin and direction.
3. Server validates fire rate, raycasts, and applies damage.
4. Visual effects run client-side only.

## Notes

- Never trust client damage values.
- Keep gameplay logic on the server.
- Effects should not affect gameplay.
