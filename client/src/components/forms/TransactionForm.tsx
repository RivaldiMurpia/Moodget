"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import Input from "../ui/input";
import Select from "../ui/select";
import Card from "../ui/card";
import CardContent from "../ui/card";
import CardHeader from "../ui/card";
import CardTitle from "../ui/card";
import Checkbox from "../ui/checkbox";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface FormData {
  amount: string;
  description: string;
  categoryId: string;
  transactionDate: string;
}

export default function TransactionForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    description: "",
    categoryId: "",
    transactionDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);
        
        if (!categoriesRes.ok || !tagsRes.ok) throw new Error("Failed to fetch data");
        
        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();
        
        setCategories(categoriesData.categories);
        setTags(tagsData.tags);
      } catch (err) {
        setError("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tagIds: selectedTags,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create transaction");
      }
      
      router.refresh(); // Refresh the page to show new transaction
      // Reset form
      setFormData({
        amount: "",
        description: "",
        categoryId: "",
        transactionDate: new Date().toISOString().split('T')[0],
      });
      setSelectedTags([]);
    } catch (err: any) {
      setError(err.message || "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gray-900">Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount</label>
              <Input
                type="number"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Input
              name="description"
              placeholder="What did you spend on?"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select
              options={categories.map(category => ({
                value: category.id.toString(),
                label: category.name
              }))}
              value={formData.categoryId}
              onChange={(value: string) => 
                setFormData(prev => ({ ...prev, categoryId: value }))
              }
              placeholder="Select a category"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Emotional Tags</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {tags.map(tag => (
                <Checkbox 
                  key={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  label={tag.name}
                  size="sm"
                  className="mb-2"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
