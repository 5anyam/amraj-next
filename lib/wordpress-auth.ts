// utils/wordpress-auth.ts
export interface WordPressUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    roles: string[];
  }
  
  export class WordPressAuth {
    private static readonly WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.amraj.in';
    private static readonly TOKEN_KEY = 'wp_token';
    private static readonly USER_KEY = 'wp_user';
  
    // Check if user is logged in
    static isLoggedIn(): boolean {
      if (typeof window === 'undefined') return false;
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
  
    // Get stored token
    static getToken(): string | null {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(this.TOKEN_KEY);
    }
  
    // Get stored user data
    static getUser(): WordPressUser | null {
      if (typeof window === 'undefined') return null;
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
  
    // Login method
    static async login(username: string, password: string): Promise<{
      success: boolean;
      user?: WordPressUser;
      error?: string;
    }> {
      try {
        // Step 1: Authenticate
        const authResponse = await fetch(`${this.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!authResponse.ok) {
          const errorData = await authResponse.json();
          return { success: false, error: errorData.message || 'Login failed' };
        }
  
        const authData = await authResponse.json();
        const { token } = authData;
  
        // Step 2: Get user data
        const userResponse = await fetch(`${this.WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!userResponse.ok) {
          return { success: false, error: 'Failed to fetch user data' };
        }
  
        const userData: WordPressUser = await userResponse.json();
  
        // Step 3: Store data
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  
        return { success: true, user: userData };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'An error occurred' 
        };
      }
    }
  
    // Logout method
    static logout(): void {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  
    // Make authenticated API calls
    static async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      };
  
      return fetch(`${this.WORDPRESS_URL}/wp-json${endpoint}`, {
        ...options,
        headers,
      });
    }
  
    // Get user posts
    static async getUserPosts(): Promise<[]> {
      try {
        const response = await this.apiCall('/wp/v2/posts?author=' + this.getUser()?.id);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return await response.json();
      } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
      }
    }
  
    // Get user profile
    static async getUserProfile(): Promise<WordPressUser | null> {
      try {
        const response = await this.apiCall('/wp/v2/users/me');
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    }
  
    // Validate token
    static async validateToken(): Promise<boolean> {
      try {
        const response = await this.apiCall('/jwt-auth/v1/token/validate');
        return response.ok;
      } catch (error) {
        console.error('Token validation failed:', error);
        return false;
      }
    }
  }