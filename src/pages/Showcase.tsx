import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles, Image, Package, Layers, Table, HelpCircle } from 'lucide-react';
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
    { title: 'What is React?', content: 'React is a component-based JavaScript library designed for rendering reactive, high-performance user interfaces.' },
    { title: 'Why use Tailwind CSS?', content: 'Tailwind CSS is a utility-first stylesheet builder for rapidly assembling responsive layouts directly in your HTML.' },
    { title: 'What is a React Hook?', content: 'Hooks are specialized runtime functions that let you subscribe to state, synchronizations, and concurrent transitions without writing ES6 classes.' },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', role: 'Staff Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Lead Architect', status: 'Active' },
    { id: 3, name: 'Bob Johnson', role: 'Operations Manager', status: 'Suspended' },
  ];

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Role', accessor: 'role' as const },
    { header: 'Status', accessor: (item: any) => (
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${
        item.status === 'Active' 
          ? 'bg-brand-green/10 text-brand-green border-brand-green/20' 
          : 'bg-brand-red/10 text-brand-red border-brand-red/20'
      }`}>
        {item.status}
      </span>
    )},
  ];

  const dropdownOptions = [
    { value: 'option1', label: 'Database Module 01' },
    { value: 'option2', label: 'Concurrent Module 02' },
    { value: 'option3', label: 'Lifecycle Module 03' },
  ];

  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        {/* Title */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-brand-blue">
              <Compass size={20} />
            </span>
            <span className="text-xs font-bold text-textColor-secondary/60 uppercase tracking-wide">Design Showcase</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-textColor-primary leading-tight">
            UI Design Gallery
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Explore fully styled, interactive custom components engineered with Tailwind CSS utility parameters.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Hero Banner Section */}
          <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-4 flex items-center gap-2 border-b border-borderColor/40 pb-3">
              <Sparkles size={18} className="text-brand-blue" />
              1. Hero Banner Component
            </h2>
            <HeroBanner 
              title="Welcome to React Tutorials"
              subtitle="Master modern web development with practical examples, visual profiling, and agentic code labs."
              ctaText="Start Learning Now"
              onCtaClick={() => alert('CTA Button Clicked!')}
            />
          </section>

          {/* Product Cards Section */}
          <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2 border-b border-borderColor/40 pb-3">
              <Package size={18} className="text-brand-green" />
              2. Product Showcase Cards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <ProductCard 
                id="1"
                title="Premium Headphones"
                price={299}
                image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                category="Electronics"
              />
              <ProductCard 
                id="2"
                title="Ergonomic Workstation Chair"
                price={199}
                image="https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                category="Furniture"
              />
              <ProductCard 
                id="3"
                title="Mechanical Keyboard"
                price={149}
                image="https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                category="Peripherals"
              />
            </div>
          </section>

          {/* Carousel Section */}
          <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-4 flex items-center gap-2 border-b border-borderColor/40 pb-3">
              <Image size={18} className="text-brand-gold" />
              3. Image Carousel Slider
            </h2>
            <Carousel images={images} />
          </section>

          {/* Accordion & Dropdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Accordion Column */}
            <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
              <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2 border-b border-borderColor/40 pb-3">
                <HelpCircle size={18} className="text-purple-500" />
                4. Accordion Toggle List
              </h2>
              <Accordion items={accordionItems} />
            </section>

            {/* Dropdown Column */}
            <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
              <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2 border-b border-borderColor/40 pb-3">
                <Layers size={18} className="text-brand-blue" />
                5. Selection Dropdown
              </h2>
              <div className="h-48 rounded-xl border border-borderColor/50 p-6 bg-slate-50/50 flex flex-col justify-center items-center">
                <label className="block text-xs font-bold text-textColor-secondary mb-3 uppercase tracking-wider">Select a Lab Option</label>
                <Dropdown 
                  label="Choose Module" 
                  options={dropdownOptions} 
                  onSelect={(val) => alert(`Selected action: ${val}`)} 
                />
              </div>
            </section>

          </div>

          {/* Data Table Section */}
          <section className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <h2 className="text-lg font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2 border-b border-borderColor/40 pb-3">
              <Table size={18} className="text-brand-blue" />
              6. Interactive Data Table
            </h2>
            <DataTable data={tableData} columns={columns} />
          </section>

        </div>
      </div>
    </div>
  );
};

export default Showcase;
