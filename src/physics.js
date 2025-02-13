function applyGravity(projectile) {
    const gravity = -9.81; // Gravity constant
    projectile.velocity.y += gravity * 0.016; // Update velocity based on gravity
}

function checkCollision(projectile, target) {
    const distance = projectile.position.distanceTo(target.position);
    const combinedRadius = projectile.radius + target.radius;

    if (distance < combinedRadius) {
        return true; // Collision detected
    }
    return false; // No collision
}

export { applyGravity, checkCollision };