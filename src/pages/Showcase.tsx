import React from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import ProductCard from '../components/ui/ProductCard';
import Carousel from '../components/ui/Carousel';
import Accordion from '../components/ui/Accordion';
import DataTable from '../components/ui/DataTable';
import Dropdown from '../components/ui/Dropdown';

const Showcase: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
    'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2762&q=80',
    'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
  ];

  const accordionItems = [
    { title: 'What is React?', content: 'React is a JavaScript library for building user interfaces.' },
    { title: 'Why use Tailwind CSS?', content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.' },
    { title: 'What is a Hook?', content: 'Hooks are functions that let you use state and other React features without writing a class.' },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', status: 'Inactive' },
  ];

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Role', accessor: 'role' as const },
    { header: 'Status', accessor: (item: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {item.status}
      </span>
    )},
  ];

  const dropdownOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="space-y-16">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Hero Banner</h2>
        <HeroBanner 
          title="Welcome to React Tutorials"
          subtitle="Master modern web development with practical examples and deep dives."
          ctaText="Start Learning"
          onCtaClick={() => alert('Start Learning Clicked')}
        />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Product Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            id="1"
            title="Premium Headphones"
            price={299}
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            category="Electronics"
          />
          <ProductCard 
            id="2"
            title="Ergonomic Chair"
            price={199}
            image="https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            category="Furniture"
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Carousel</h2>
        <Carousel images={images} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Accordion</h2>
          <Accordion items={accordionItems} />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Dropdown</h2>
          <div className="h-64 border rounded-xl p-8 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select an option</label>
            <Dropdown 
              label="Select Option" 
              options={dropdownOptions} 
              onSelect={(val) => alert(`Selected: ${val}`)} 
            />
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Latest Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="group relative bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-8 text-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <i className="fas fa-bolt text-9xl"></i>
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold mb-4">
                    NEW • PERFORMANCE
                </span>
                <h3 className="text-2xl font-bold mb-2">Frontend Performance Guide</h3>
                <p className="text-blue-100 mb-6">
                    Why your app feels slow, the "React Render" myth, and how to debug Jank interactively.
                </p>
                <a href="/tutorials/performance" className="inline-flex items-center px-5 py-2.5 bg-white text-blue-700 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                    Start Interactive Demo
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </div>
           </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Data Table</h2>
        <DataTable data={tableData} columns={columns} />
      </section>
    </div>
  );
};

export default Showcase;
