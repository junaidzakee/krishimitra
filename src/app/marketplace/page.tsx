"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMarketplaceProducts } from "@/lib/demo-data";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/types/shopping-cart';

export default function MarketplacePage() {
  const { t } = useLanguage();
  const allProducts = getMarketplaceProducts(t);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    const products = category === 'All'
      ? allProducts
      : allProducts.filter(p => p.category === category);
    filterProducts(products, searchTerm);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const products = activeCategory === 'All'
      ? allProducts
      : allProducts.filter(p => p.category === activeCategory);
    filterProducts(products, term);
  };

  const filterProducts = (products: Product[], term: string) => {
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    const lowercasedTerm = term.toLowerCase();
    setFilteredProducts(
      products.filter(p => p.name.toLowerCase().includes(lowercasedTerm))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('breadcrumbs.marketplace')}</h1>
        <p className="text-muted-foreground">{t('marketplace.description')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('marketplace.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryFilter(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative w-full h-48">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-xl font-bold">₹{product.price.toFixed(2)}</p>
              <Button onClick={() => toast({ title: t('marketplace.toast.addedToCart', { name: product.name }) })}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t('marketplace.addToCart')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
            <p className="text-muted-foreground">{t('marketplace.noProducts')}</p>
        </div>
      )}
    </div>
  );
}
