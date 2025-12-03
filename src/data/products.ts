import type { Category, Product } from '../types';

const library: Record<Category, Array<Omit<Product, 'id' | 'category'>>> = {
  Book: [
    {
      title: '1984',
      genre: 'Science Fiction',
      price: 13.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'A dystopian classic about surveillance and control.',
      details: {
        author: 'George Orwell',
        publisher: 'Secker & Warburg',
        pages: 328,
        language: 'English',
        isbn: '978-0-452-28423-4',
      },
    },
    {
      title: 'Dune',
      genre: 'Science Fiction',
      price: 18.99,
      stock: 24,
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Epic science fiction saga on the desert planet Arrakis.',
      details: {
        author: 'Frank Herbert',
        publisher: 'Chilton Books',
        pages: 412,
        language: 'English',
        isbn: '978-0-441-17271-9',
      },
    },
    {
      title: 'The Hobbit',
      genre: 'Fantasy',
      price: 14.99,
      stock: 26,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Bilbo Baggins embarks on an unexpected adventure.',
      details: {
        author: 'J.R.R. Tolkien',
        publisher: 'George Allen & Unwin',
        pages: 310,
        language: 'English',
        isbn: '978-0-618-00221-3',
      },
    },
    {
      title: 'Pride and Prejudice',
      genre: 'Romance',
      price: 12.99,
      stock: 22,
      image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'A classic tale of manners, upbringing, and marriage.',
      details: {
        author: 'Jane Austen',
        publisher: 'T. Egerton',
        pages: 279,
        language: 'English',
        isbn: '978-1-85326-000-2',
      },
    },
    {
      title: 'The Great Gatsby',
      genre: 'Fiction',
      price: 15.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'A portrait of the Jazz Age and the elusive Jay Gatsby.',
      details: {
        author: 'F. Scott Fitzgerald',
        publisher: "Charles Scribner's Sons",
        pages: 218,
        language: 'English',
        isbn: '978-0-7432-7356-5',
      },
    },
  ],
  CD: [
    {
      title: 'Abbey Road',
      genre: 'Rock',
      price: 12.99,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Iconic album by The Beatles.',
      details: { artist: 'The Beatles', label: 'Apple', tracks: 17, release: '1969' },
    },
    {
      title: 'Back in Black',
      genre: 'Hard Rock',
      price: 13.99,
      stock: 32,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'AC/DCs best-selling comeback album.',
      details: { artist: 'AC/DC', label: 'Atlantic', tracks: 10, release: '1980' },
    },
    {
      title: 'Dark Side of the Moon',
      genre: 'Progressive Rock',
      price: 14.99,
      stock: 28,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Pink Floyds seminal concept album.',
      details: { artist: 'Pink Floyd', label: 'Harvest', tracks: 10, release: '1973' },
    },
    {
      title: 'Inception',
      genre: 'Soundtrack',
      price: 18.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Hans Zimmer score with iconic BRAAAM.',
      details: { artist: 'Hans Zimmer', label: 'Reprise', tracks: 12, release: '2010' },
    },
    {
      title: 'Rumours',
      genre: 'Rock',
      price: 12.49,
      stock: 29,
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Fleetwood Macs timeless classic.',
      details: { artist: 'Fleetwood Mac', label: 'Warner Bros.', tracks: 11, release: '1977' },
    },
  ],
  Newspaper: [
    {
      title: 'Financial Times',
      genre: 'Business News',
      price: 4.5,
      stock: 79,
      image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Global business and markets coverage.',
      details: { frequency: 'Daily', editor: 'Roula Khalaf', issn: '0307-1766' },
    },
    {
      title: 'The Guardian',
      genre: 'Daily News',
      price: 3.0,
      stock: 90,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Independent journalism and features.',
      details: { frequency: 'Daily', editor: 'Katharine Viner', issn: '0261-3077' },
    },
    {
      title: 'The New York Times',
      genre: 'Daily News',
      price: 3.5,
      stock: 95,
      image: 'https://images.unsplash.com/photo-1513343041531-167ff87cfa54?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'U.S. and world news with analysis.',
      details: { frequency: 'Daily', editor: 'Joe Kahn', issn: '0362-4331' },
    },
    {
      title: 'The Wall Street Journal',
      genre: 'Business News',
      price: 4.0,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Business, finance, and markets insights.',
      details: { frequency: 'Daily', editor: 'Emma Tucker', issn: '0099-9660' },
    },
    {
      title: 'The Guardian Weekly',
      genre: 'Weekly News',
      price: 3.75,
      stock: 70,
      image: 'https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Weekly digest of global coverage.',
      details: { frequency: 'Weekly', editor: 'Will Dean', issn: '0261-3077' },
    },
  ],
  DVD: [
    {
      title: 'The Dark Knight',
      genre: 'Action',
      price: 19.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Christopher Nolans gritty Batman epic.',
      details: { director: 'Christopher Nolan', runtime: '152 min', studio: 'Warner Bros.' },
    },
    {
      title: 'The Lord of the Rings',
      genre: 'Fantasy',
      price: 22.99,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Fellowship begins the journey to Mordor.',
      details: { director: 'Peter Jackson', runtime: '178 min', studio: 'New Line Cinema' },
    },
    {
      title: 'Inception',
      genre: 'Science Fiction',
      price: 18.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'A mind-bending heist across dream layers.',
      details: { director: 'Christopher Nolan', runtime: '148 min', studio: 'Warner Bros.' },
    },
    {
      title: 'Pulp Fiction',
      genre: 'Crime',
      price: 17.99,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Quentin Tarantinos cult classic.',
      details: { director: 'Quentin Tarantino', runtime: '154 min', studio: 'Miramax' },
    },
    {
      title: 'The Two Towers',
      genre: 'Fantasy',
      price: 16.99,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Middle chapters of the LOTR trilogy.',
      details: { director: 'Peter Jackson', runtime: '179 min', studio: 'New Line Cinema' },
    },
  ],
};

export const products: Product[] = (() => {
  const output: Product[] = [];
  (Object.keys(library) as Category[]).forEach(category => {
    const templates = library[category];
    const repeat = Math.ceil(25 / templates.length);
    let count = 0;
    for (let i = 0; i < repeat && count < 25; i += 1) {
      templates.forEach(template => {
        if (count >= 25) return;
        count += 1;
        output.push({
          ...template,
          category,
          id: `${category}-${count}`,
          title: `${template.title} ${count}`,
        });
      });
    }
  });
  return output;
})();
