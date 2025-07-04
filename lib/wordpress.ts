// WordPress API Utilities für headless CMS Integration

const WORDPRESS_API_URL = 'https://cockpit4me.de/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  link: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
  type?: string;
  _embedded?: {
    author?: Array<{
      name: string;
      avatar_urls: {
        '96': string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      taxonomy: string;
    }>>;
  };
}

export interface WordPressPortfolio {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  link: string;
  featured_media: number;
  type: string;
  acf?: {
    project_url?: string;
    client_name?: string;
    project_type?: string;
    technologies?: string;
    completion_date?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      taxonomy: string;
    }>>;
  };
}

export interface WordPressPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  link: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressCustomPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  link: string;
  featured_media: number;
  type?: string;
  acf?: Record<string, any>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      taxonomy: string;
    }>>;
  };
}

// Utility Functions
export const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: einfache Regex-basierte HTML-Entfernung
    return html.replace(/<[^>]*>/g, '');
  }
  // Client-side: DOM-basierte HTML-Entfernung
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const formatDate = (dateString: string, locale: string = 'de-DE'): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getExcerpt = (content: string, maxLength: number = 150): string => {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// API Functions
export const fetchPosts = async (params: {
  per_page?: number;
  page?: number;
  categories?: string;
  tags?: string;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<WordPressPost[]> => {
  const searchParams = new URLSearchParams({
    _embed: 'true',
    per_page: '10',
    orderby: 'date',
    order: 'desc',
    ...params
  });

  const response = await fetch(`${WORDPRESS_API_URL}/posts?${searchParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchPortfolio = async (params: {
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<WordPressPortfolio[]> => {
  const searchParams = new URLSearchParams({
    'type[]': 'post',
    'type[]': 'portfolio',
    _embed: 'true',
    per_page: '10',
    orderby: 'date',
    order: 'desc',
    ...params
  });

  const response = await fetch(`${WORDPRESS_API_URL}/posts?${searchParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Filtere nur Portfolio-Items
  return data.filter((item: WordPressPortfolio) => 
    item.type === 'portfolio' || 
    item.acf?.project_url || 
    item.acf?.client_name
  );
};

export const fetchPages = async (params: {
  per_page?: number;
  page?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<WordPressPage[]> => {
  const searchParams = new URLSearchParams({
    _embed: 'true',
    per_page: '10',
    orderby: 'menu_order',
    order: 'asc',
    ...params
  });

  const response = await fetch(`${WORDPRESS_API_URL}/pages?${searchParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchCustomPosts = async (
  postType: string,
  params: {
    per_page?: number;
    page?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}
): Promise<WordPressCustomPost[]> => {
  const searchParams = new URLSearchParams({
    type: postType,
    _embed: 'true',
    per_page: '10',
    orderby: 'date',
    order: 'desc',
    ...params
  });

  const response = await fetch(`${WORDPRESS_API_URL}/posts?${searchParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${postType}: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchPostById = async (id: number): Promise<WordPressPost> => {
  const response = await fetch(`${WORDPRESS_API_URL}/posts/${id}?_embed=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch post ${id}: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchPageById = async (id: number): Promise<WordPressPage> => {
  const response = await fetch(`${WORDPRESS_API_URL}/pages/${id}?_embed=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${id}: ${response.statusText}`);
  }
  
  return response.json();
};

// Search Function
export const searchContent = async (
  query: string,
  postTypes: string[] = ['posts', 'portfolio']
): Promise<{
  posts: WordPressPost[];
  portfolio: WordPressPortfolio[];
  total: number;
}> => {
  const results = await Promise.allSettled([
    fetchPosts({ search: query, per_page: '5' }),
    fetchPortfolio({ search: query, per_page: '5' })
  ]);

  const posts: WordPressPost[] = results[0].status === 'fulfilled' ? results[0].value : [];
  const portfolio: WordPressPortfolio[] = results[1].status === 'fulfilled' ? results[1].value : [];

  return {
    posts,
    portfolio,
    total: posts.length + portfolio.length
  };
};

// Categories and Tags
export const fetchCategories = async (): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> => {
  const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchTags = async (): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> => {
  const response = await fetch(`${WORDPRESS_API_URL}/tags?per_page=100`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }
  
  return response.json();
};