import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const name = data.name?.trim();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = data.slug
      ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'A category with this name or slug already exists' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        image: data.image || null
      }
    });

    return NextResponse.json({ message: 'Category added successfully', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Failed to add category:", error);
    return NextResponse.json({ error: error.message || 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Category ID or Slug is required' }, { status: 400 });
    }

    if (id) {
      await prisma.category.delete({ where: { id } });
    } else {
      await prisma.category.delete({ where: { slug } });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
