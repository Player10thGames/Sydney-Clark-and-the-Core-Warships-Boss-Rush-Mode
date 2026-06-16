export interface Collidable {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}

export class CollisionManager {
  checkCollision(entity1: Collidable, entity2: Collidable): boolean {
    // Use circle collision detection
    const radius1 = entity1.radius || (entity1.width || 16) / 2;
    const radius2 = entity2.radius || (entity2.width || 16) / 2;
    
    const dx = entity1.x - entity2.x;
    const dy = entity1.y - entity2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < radius1 + radius2;
  }

  checkCollisionRect(entity1: Collidable, entity2: Collidable): boolean {
    // Use rectangle collision detection (AABB)
    const x1 = entity1.x - (entity1.width || 16) / 2;
    const y1 = entity1.y - (entity1.height || 16) / 2;
    const w1 = entity1.width || 16;
    const h1 = entity1.height || 16;
    
    const x2 = entity2.x - (entity2.width || 16) / 2;
    const y2 = entity2.y - (entity2.height || 16) / 2;
    const w2 = entity2.width || 16;
    const h2 = entity2.height || 16;
    
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  isOutOfBounds(entity: Collidable, gameWidth: number, gameHeight: number): boolean {
    const radius = entity.radius || 16;
    return (
      entity.x - radius < 0 ||
      entity.x + radius > gameWidth ||
      entity.y - radius < 0 ||
      entity.y + radius > gameHeight
    );
  }
}
