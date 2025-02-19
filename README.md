# Web Game: Cannon Shooting Game

This project is a web-based game where players control a cannon to fire projectiles at distant targets, such as stacked cubes and cylinders. The game utilizes the Three.js library for 3D rendering and includes physics for realistic projectile motion and impact. Particle systems are used to simulate explosions for cannon shots and projectile collisions.

## Project Structure

```
web-game
├── src
│   ├── index.html        # Main HTML document
│   ├── main.js           # Entry point of the application
│   ├── cannon.js         # Cannon class for controlling the cannon
│   ├── projectile.js     # Projectile class for fired projectiles
│   ├── target.js         # Target class for stack of cubes/cylinders
│   ├── physics.js        # Physics simulation functions
│   └── particles.js      # Particle system for explosions
├── css
│   └── styles.css        # Styles for the game
├── assets
│   └── [optional-assets]  # Optional assets like textures/models
├── package.json          # npm configuration file
└── README.md             # Project documentation
```

## Instructions for Installing Dependencies and Running the Project

1. Ensure you have Node.js installed on your machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies listed in `package.json`.
4. Open `src/index.html` in a web browser to run the game.

## Dependencies

This project uses the following dependencies:

- Three.js: A JavaScript library for creating 3D graphics in the browser.

## Gameplay

- Use the controls to aim and fire the cannon at the targets.
- Try to knock down as many targets as possible with your projectiles.
- Enjoy the visual effects of explosions upon impact!

Feel free to modify and expand the game as you see fit!