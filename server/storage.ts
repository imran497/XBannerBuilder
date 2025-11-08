import { type User, type InsertUser, type GitHubUser, type InsertGitHubUser, type BannerDesign, type InsertBannerDesign } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGitHubUser(githubId: string): Promise<GitHubUser | undefined>;
  getGitHubUserById(id: string): Promise<GitHubUser | undefined>;
  createGitHubUser(user: InsertGitHubUser): Promise<GitHubUser>;
  updateGitHubUserToken(githubId: string, accessToken: string): Promise<void>;
  
  getBannerDesigns(githubUserId: string): Promise<BannerDesign[]>;
  getBannerDesign(id: string): Promise<BannerDesign | undefined>;
  createBannerDesign(design: InsertBannerDesign): Promise<BannerDesign>;
  updateBannerDesign(id: string, canvasData: any): Promise<void>;
  deleteBannerDesign(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private githubUsers: Map<string, GitHubUser>;
  private bannerDesigns: Map<string, BannerDesign>;

  constructor() {
    this.users = new Map();
    this.githubUsers = new Map();
    this.bannerDesigns = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGitHubUser(githubId: string): Promise<GitHubUser | undefined> {
    return Array.from(this.githubUsers.values()).find(
      (user) => user.githubId === githubId,
    );
  }

  async getGitHubUserById(id: string): Promise<GitHubUser | undefined> {
    return this.githubUsers.get(id);
  }

  async createGitHubUser(insertGitHubUser: InsertGitHubUser): Promise<GitHubUser> {
    const id = randomUUID();
    const user: GitHubUser = {
      ...insertGitHubUser,
      id,
      createdAt: new Date(),
    };
    this.githubUsers.set(id, user);
    return user;
  }

  async updateGitHubUserToken(githubId: string, accessToken: string): Promise<void> {
    const user = await this.getGitHubUser(githubId);
    if (user) {
      user.accessToken = accessToken;
      this.githubUsers.set(user.id, user);
    }
  }

  async getBannerDesigns(githubUserId: string): Promise<BannerDesign[]> {
    return Array.from(this.bannerDesigns.values()).filter(
      (design) => design.githubUserId === githubUserId,
    );
  }

  async getBannerDesign(id: string): Promise<BannerDesign | undefined> {
    return this.bannerDesigns.get(id);
  }

  async createBannerDesign(insertDesign: InsertBannerDesign): Promise<BannerDesign> {
    const id = randomUUID();
    const now = new Date();
    const design: BannerDesign = {
      ...insertDesign,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.bannerDesigns.set(id, design);
    return design;
  }

  async updateBannerDesign(id: string, canvasData: any): Promise<void> {
    const design = this.bannerDesigns.get(id);
    if (design) {
      design.canvasData = canvasData;
      design.updatedAt = new Date();
      this.bannerDesigns.set(id, design);
    }
  }

  async deleteBannerDesign(id: string): Promise<void> {
    this.bannerDesigns.delete(id);
  }
}

export const storage = new MemStorage();
