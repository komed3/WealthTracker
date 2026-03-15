import { clsx, type ClassValue } from 'clsx';
import { LayoutDashboard, TrendingUp, PieChart, ClipboardList, BarChart3, BookOpen, Cpu, Gem, Settings2, ChevronRight, Globe, Coins } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { AppData, CURRENCIES, LANGUAGES } from './types';

import Allocation from './views/Allocation';
import Editor from './views/Editor';
import Insight from './views/Insight';
import Inventory from './views/Inventory';
import Momentum from './views/Momentum';
import Snapshot from './views/Snapshot';
import Tangibles from './views/Tangibles';
