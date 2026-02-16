import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

// Sample Product Data //
const sampleProducts = [
    {
        name: 'Wireless Headphones',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
        name: 'Laptop Backpack',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    },
    {
        name: 'USB-C Hub',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    },
    {
        name: 'Mechanical Keyboard',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
    },
    {
        name: 'Wireless Mouse',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    },
    {
        name: 'Phone Stand',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    },
    {
        name: 'Desk Lamp',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
    },
    {
        name: 'Bluetooth Speaker',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    },
    {
        name: 'Webcam HD',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    },
];

// Seed Products Function //
export async function seedProducts(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);

    // Check if products already exist //
    const count = await productRepository.count();
    if (count > 0) {
        console.log('Products already seeded, skipping...');
        return;
    }

    // Insert sample products //
    await productRepository.save(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products successfully`);
}
