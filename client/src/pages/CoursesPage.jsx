import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SkeletonGrid } from '../components/ui/Skeleton';
import DepthCarousel from '../components/ui/DepthCarousel';
import { Search, Star, Layers, User, ArrowRight, Clock, Sparkles, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  // Fetch initial all-courses once for Quick Find carousel
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await api.getCourses('');
        setAllCourses(res.courses || []);
      } catch (err) {
        console.error('Failed to load top courses', err);
      }
    }
    loadAll();
  }, []);

  // Fetch filtered courses for the grid
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category) query.append('category', category);
        if (level) query.append('level', level);

        const res = await api.getCourses(query.toString());
        setCourses(res.courses || []);
      } catch (err) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, category, level]);

  // Derive top-rated popular courses for the Depth Carousel
  const topCourses = useMemo(() => {
    const source = allCourses.length > 0 ? allCourses : courses;
    if (!source || source.length === 0) return [];
    
    // Sort by rating descending (fallback to 4.8)
    return [...source].sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8)).slice(0, 7);
  }, [allCourses, courses]);

  const handleCourseClick = (course) => {
    if (course && course.slug) {
      navigate(`/courses/${course.slug}`);
    }
  };

  const renderCarouselCard = (course, isActive) => {
    const instructorName = course.instructorId?.name || 'Dr. Sarah Vance';
    const courseDuration = course.duration || '6 Weeks';

    return (
      <div 
        className="flex flex-col h-full bg-white select-none overflow-hidden group cursor-pointer"
        onClick={() => handleCourseClick(course)}
      >
        {/* Thumbnail Image Header */}
        <div className="h-36 bg-slate-100 relative overflow-hidden flex-shrink-0">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          
          {/* Top category badge */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-indigo-700 border border-indigo-100 shadow-sm flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-600" />
            <span>{course.category || 'General'}</span>
          </div>

          {/* Top rating badge */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-white text-white" />
            <span>{course.rating || 4.9}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            {/* Level & Duration Pills */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                {course.level || 'Intermediate'}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                {courseDuration}
              </span>
            </div>

            {/* Course Title */}
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
              {course.title}
            </h3>

            {/* Instructor */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <div className="w-4.5 h-4.5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <User className="w-2.5 h-2.5 text-slate-500" />
              </div>
              <span className="truncate font-medium">{instructorName}</span>
            </div>
          </div>

          {/* Action Button - Lumen CTA style */}
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCourseClick(course);
              }}
              className="btn-primary w-full text-xs h-8 px-3 gap-1.5"
            >
              <span>View Course</span>
              <ArrowRight className="w-3 h-3" />
              <i className="lumen-ring" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Learning Experience</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Course Catalog</h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Browse our comprehensive course catalog. Explore structured learning paths, interactive quizzes, and hands-on lab challenges.
        </p>
      </div>

      {/* Dynamic Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field py-2.5 text-xs font-medium w-auto"
          >
            <option value="">All Categories</option>
            <option value="Core JavaScript">Core JavaScript</option>
            <option value="Async JavaScript">Async JavaScript</option>
            <option value="React Framework">React Framework</option>
            <option value="Data Structures">Data Structures</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input-field py-2.5 text-xs font-medium w-auto"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: Quick Find (40%) | All Courses (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (~40%): Quick Find Depth Carousel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-3xl bg-gradient-to-b from-white to-blue-50/40 border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Find</h2>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">Discover popular and highly rated courses.</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 border border-blue-200 px-2.5 py-1 rounded-full">
              Top Rated
            </span>
          </div>

          {/* Carousel Container - Height fits content (h-[350px]) */}
          <div className="h-[350px] relative w-full flex items-center justify-center">
            {topCourses.length > 0 ? (
              <DepthCarousel
                items={topCourses}
                cardWidth={260}
                cardHeight={330}
                radius={16}
                tint="#0f172a"
                depth={170}
                spread={60}
                tilt={18}
                tiltDirection="right"
                perspective={1400}
                visibleCards={4}
                falloff={0.2}
                blur={4}
                autoplay={true}
                autoplayDelay={3600}
                loop={true}
                showControls={true}
                showIndicators={true}
                onItemClick={handleCourseClick}
                renderCard={renderCarouselCard}
              />
            ) : (
              <div className="text-center text-slate-400 text-sm py-8">
                Loading featured courses...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (~60%): All Courses Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <h2 className="text-xl font-bold text-slate-900">All Courses</h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : courses.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-2 bg-white rounded-2xl border border-slate-200">
              <p className="text-base font-semibold text-slate-700">No courses match your active filter criteria.</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setCategory(''); setLevel(''); }}
                className="text-xs text-blue-600 underline font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-card-hover hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-blue-700 border border-blue-100 shadow-sm">
                        {course.level}
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono font-semibold">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{course.category}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1.5 truncate pr-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.instructorId?.name || 'Dr. Sarah Vance'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {course.rating || 4.8}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="btn-primary w-full text-xs h-9 px-3 gap-1.5"
                    >
                      <span>View Course Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <i className="lumen-ring" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}


