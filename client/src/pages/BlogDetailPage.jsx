import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, User, Calendar, ArrowLeft, Sparkles } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getBlogBySlug(slug);
        setBlog(res.blog);
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-500 font-medium">
        Loading article...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-bold text-slate-800">Article not found</h2>
        <Link to="/blogs" className="btn-primary text-xs h-10 px-5">
          <span>Back to Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Blogs</span>
        </Link>

        {/* Article Main Card Container */}
        <article className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
          
          {/* Header & Meta Info */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {blog.category || 'Insights'}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.25]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                {blog.authorName || 'Learnova Labs'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Optional Article Summary Box */}
          {blog.summary && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              {blog.summary}
            </div>
          )}

          {/* Article Main Text Content */}
          <div className="text-slate-800 space-y-6 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
            {blog.content}
          </div>

        </article>

      </div>
    </div>
  );
}
