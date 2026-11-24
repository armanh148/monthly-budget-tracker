// Navy Blue, Red & Black Luxury Theme
// Core Triad:
// 1. Navy Blue: #0A192F (Deep Navy) | #1E3A8A (Royal Navy) | #2563EB (Electric Blue)
// 2. Red: #DC2626 (Crimson Red) | #EF4444 (Vibrant Red) | #991B1B (Deep Ruby Red)
// 3. Black: #000000 (Pure Pitch Black) | #050811 (Midnight Black) | #0A0F1D (Obsidian Surface)

export const palette = {
  // Light Theme: Crisp Canvas with Rich Navy Blue, Crimson Red, and Bold Black Accents
  light: {
    name: 'light',
    background: '#F8FAFC', // Crisp Slate Canvas
    sheetBackground: '#FFFFFF',
    topBackdrop: '#0A192F', // Iconic Deep Navy Blue Header
    topBackdropDark: '#050D1A',
    topHeaderBg: '#0A192F',

    surface: '#FFFFFF', // Elevated Pure White Card
    surfaceSubtle: '#F1F5F9', // Crisp Light Surface
    surfaceHover: '#E2E8F0',
    border: 'rgba(10, 25, 47, 0.14)', // Navy Border
    borderSubtle: '#E2E8F0',
    clayBorderTop: '#FFFFFF',
    clayBorderBottom: '#CBD5E1',

    // Hero Balance Card: Deep Navy Blue #0A192F with Red & Metallic Edge
    brandCard: '#0A192F',
    brandCardHighlight: 'rgba(37, 99, 235, 0.5)',
    brandCardBottom: '#000000',
    brandCardBorder: 'rgba(220, 38, 38, 0.65)',
    brandCardText: '#FFFFFF',

    // Typography
    text: '#000000', // Jet Black
    textWhite: '#FFFFFF',
    textSecondary: '#334155',
    textTertiary: '#64748B',
    textMuted: '#94A3B8',

    // Brand Accents
    primary: '#0A192F', // Deep Navy Blue
    primaryDark: '#000000', // Jet Black
    primaryLight: 'rgba(10, 25, 47, 0.10)',
    primaryText: '#FFFFFF',

    // Financial Metrics
    income: '#1E3A8A', // Navy Blue
    incomeDark: '#0A192F',
    incomeHighlight: '#93C5FD',
    incomeLight: 'rgba(30, 58, 138, 0.12)',
    incomeSurface: '#1E3A8A',
    incomeBorder: '#0A192F',

    expense: '#DC2626', // Crimson Red
    expenseDark: '#991B1B',
    expenseHighlight: '#EF4444',
    expenseLight: 'rgba(220, 38, 38, 0.12)',
    expenseSurface: '#DC2626',
    expenseBorder: '#991B1B',

    warning: '#DC2626',
    warningDark: '#991B1B',
    warningLight: '#FEF2F2',
    warningSurface: '#DC2626',
    warningBorder: '#991B1B',

    info: '#1E3A8A',
    infoDark: '#0A192F',
    infoLight: '#EFF6FF',

    // 4 Action Tiles
    tileMint: '#0A192F', // Tile 1: Income (Navy Blue)
    tileMintTop: '#1E3A8A',
    tileMintBottom: '#000000',
    tileMintText: '#FFFFFF',

    tileCoral: '#DC2626', // Tile 2: Expense (Crimson Red)
    tileCoralTop: '#EF4444',
    tileCoralBottom: '#991B1B',
    tileCoralText: '#FFFFFF',

    tileViolet: '#1E293B', // Tile 3: Analytics (Midnight Slate)
    tileVioletTop: '#334155',
    tileVioletBottom: '#0F172A',
    tileVioletText: '#FFFFFF',

    tileCyan: '#000000', // Tile 4: Statement (Pitch Black)
    tileCyanTop: '#18181B',
    tileCyanBottom: '#000000',
    tileCyanText: '#FFFFFF',

    dockBg: '#FFFFFF',
    dockTop: 'rgba(10, 25, 47, 0.10)',
    dockBottom: '#E2E8F0',
    dockActive: '#DC2626', // Red Active Accent
    dockActiveIcon: '#FFFFFF',
    dockInactive: '#64748B',

    chartBg: '#F8FAFC',
    chartWell: '#E2E8F0',
    chartBar: '#0A192F',
    chartBarTop: '#DC2626',
    chartBarBottom: '#000000',

    shadow: 'rgba(0, 0, 0, 0.15)',
    cardShadow: '#0A192F'
  },

  // Dark Theme: Pure Midnight Pitch Black Canvas with Glowing Navy Blue & Crimson Red Accents
  dark: {
    name: 'dark',
    background: '#000000', // Pure Pitch Black Canvas
    sheetBackground: '#050811',
    topBackdrop: '#050811', // Deep Midnight Header Backdrop
    topBackdropDark: '#000000',
    topHeaderBg: '#050811',

    surface: '#0A0F1D', // Obsidian Navy Card
    surfaceSubtle: '#0F172A', // Midnight Slate Surface
    surfaceHover: '#1E293B',
    border: 'rgba(30, 58, 138, 0.35)', // Navy Stroke
    borderSubtle: 'rgba(255, 255, 255, 0.10)',
    clayBorderTop: 'rgba(255, 255, 255, 0.18)',
    clayBorderBottom: '#000000',

    // Hero Balance Card: Deep Navy Blue with Crimson Red Bevel
    brandCard: '#0A192F',
    brandCardHighlight: 'rgba(37, 99, 235, 0.55)',
    brandCardBottom: '#000000',
    brandCardBorder: 'rgba(220, 38, 38, 0.65)',
    brandCardText: '#FFFFFF',

    // Typography
    text: '#FFFFFF', // Ultra-Crisp White on Black
    textWhite: '#FFFFFF',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textMuted: '#475569',

    // Brand Accents
    primary: '#1D4ED8', // Vibrant Navy Blue
    primaryDark: '#0A192F', // Deep Navy
    primaryLight: 'rgba(29, 78, 216, 0.20)',
    primaryText: '#FFFFFF',

    // Financial Metrics
    income: '#2563EB', // Electric Blue / Navy
    incomeDark: '#1E3A8A',
    incomeHighlight: '#93C5FD',
    incomeLight: 'rgba(37, 99, 235, 0.20)',
    incomeSurface: '#2563EB',
    incomeBorder: '#1E3A8A',

    expense: '#DC2626', // Crimson Red
    expenseDark: '#991B1B',
    expenseHighlight: '#EF4444',
    expenseLight: 'rgba(220, 38, 38, 0.22)',
    expenseSurface: '#DC2626',
    expenseBorder: '#991B1B',

    warning: '#DC2626',
    warningDark: '#991B1B',
    warningLight: 'rgba(220, 38, 38, 0.20)',
    warningSurface: '#DC2626',
    warningBorder: '#991B1B',

    info: '#1D4ED8',
    infoDark: '#0A192F',
    infoLight: 'rgba(29, 78, 216, 0.18)',

    // 4 Action Tiles
    tileMint: '#1E3A8A', // Tile 1: Income (Royal Navy Blue)
    tileMintTop: '#2563EB',
    tileMintBottom: '#0A192F',
    tileMintText: '#FFFFFF',

    tileCoral: '#DC2626', // Tile 2: Expense (Crimson Red)
    tileCoralTop: '#EF4444',
    tileCoralBottom: '#991B1B',
    tileCoralText: '#FFFFFF',

    tileViolet: '#0A192F', // Tile 3: Analytics (Deep Navy Blue)
    tileVioletTop: '#1E293B',
    tileVioletBottom: '#000000',
    tileVioletText: '#FFFFFF',

    tileCyan: '#000000', // Tile 4: Statement (Pitch Black)
    tileCyanTop: '#111827',
    tileCyanBottom: '#000000',
    tileCyanText: '#FFFFFF',

    dockBg: '#050811',
    dockTop: 'rgba(30, 58, 138, 0.30)',
    dockBottom: '#000000',
    dockActive: '#DC2626', // Crimson Red Active Icon
    dockActiveIcon: '#FFFFFF',
    dockInactive: '#475569',

    chartBg: '#0A0F1D',
    chartWell: '#000000',
    chartBar: '#1D4ED8',
    chartBarTop: '#DC2626',
    chartBarBottom: '#0A192F',

    shadow: '#000000',
    cardShadow: '#0A192F'
  }
};

// Executive Elevated Card Helper
export const getClayCard = (themeMode = 'light') => {
  const isDark = themeMode === 'dark';
  return {
    backgroundColor: isDark ? '#0A0F1D' : '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(30, 58, 138, 0.35)' : 'rgba(10, 25, 47, 0.12)',
    shadowColor: isDark ? '#000000' : 'rgba(10, 25, 47, 0.10)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.5 : 0.08,
    shadowRadius: 14,
    elevation: 4
  };
};

// Executive Tactile Button Helper
export const getClayButton = (themeMode = 'light', customBg, customBottom) => {
  const isDark = themeMode === 'dark';
  let bg = customBg || (isDark ? '#1D4ED8' : '#0A192F');
  let shadow = customBottom || (isDark ? '#0A192F' : '#000000');

  if (customBg === 'income') {
    bg = isDark ? '#2563EB' : '#1E3A8A';
    shadow = isDark ? '#1E3A8A' : '#0A192F';
  } else if (customBg === 'expense') {
    bg = '#DC2626';
    shadow = '#991B1B';
  } else if (customBg === 'primary') {
    bg = isDark ? '#1D4ED8' : '#0A192F';
    shadow = isDark ? '#0A192F' : '#000000';
  }

  return {
    backgroundColor: bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  };
};

// Executive Crisp Input Helper
export const getClayInput = (themeMode = 'light') => {
  const isDark = themeMode === 'dark';
  return {
    backgroundColor: isDark ? '#050811' : '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(30, 58, 138, 0.35)' : 'rgba(10, 25, 47, 0.15)'
  };
};

// Executive Frosted Pill Helper
export const getClayPill = (themeMode = 'light') => {
  const isDark = themeMode === 'dark';
  return {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(30, 58, 138, 0.35)' : 'rgba(10, 25, 47, 0.15)',
    backgroundColor: isDark ? 'rgba(30, 58, 138, 0.18)' : 'rgba(10, 25, 47, 0.06)'
  };
};

export const categoryColors = {
  Food: {
    color: '#DC2626',
    darkColor: '#991B1B',
    bg: 'rgba(220, 38, 38, 0.14)',
    icon: 'fast-food'
  },
  Bills: {
    color: '#1E3A8A',
    darkColor: '#0A192F',
    bg: 'rgba(30, 58, 138, 0.14)',
    icon: 'flash'
  },
  Travel: {
    color: '#0A192F',
    darkColor: '#000000',
    bg: 'rgba(10, 25, 47, 0.14)',
    icon: 'car-sport'
  },
  Shopping: {
    color: '#EF4444',
    darkColor: '#B91C1C',
    bg: 'rgba(239, 68, 68, 0.14)',
    icon: 'bag-handle'
  },
  Health: {
    color: '#B91C1C',
    darkColor: '#7F1D1D',
    bg: 'rgba(185, 28, 28, 0.14)',
    icon: 'medkit'
  },
  Entertainment: {
    color: '#2563EB',
    darkColor: '#1E3A8A',
    bg: 'rgba(37, 99, 235, 0.14)',
    icon: 'game-controller'
  },
  Education: {
    color: '#1D4ED8',
    darkColor: '#0A192F',
    bg: 'rgba(29, 78, 216, 0.14)',
    icon: 'book'
  },
  General: {
    color: '#000000',
    darkColor: '#000000',
    bg: 'rgba(0, 0, 0, 0.12)',
    icon: 'cube'
  }
};
