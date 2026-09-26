import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Calendar, User, ArrowRight, Search, Sparkles } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = search ? `search=${search}` : '';
        const res = await api.getBlogs(query);
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Research & Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Educational Blogs & Research</h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Deep dives into cognitive science, Bayesian knowledge tracing, software architecture, and modern educational technology.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search articles or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div 
              key={blog._id} 
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:shadow-lg hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  {blog.category || 'Insights'}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {blog.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600">
                    <User className="w-3 h-3" />
                  </div>
                  <span>{blog.authorName || 'Learnova Labs'}</span>
                </div>

                <Link
                  to={`/blogs/${blog.slug}`}
                  className="btn-primary w-full text-xs h-9 justify-center gap-1.5"
                >
                  <span>Read Post</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <i className="lumen-ring" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

