// src/app/services/file-system.service.ts
import { Injectable } from '@angular/core';

// A very simple in-memory file system using a nested object.
// Keys with a string value are files. Keys with an object value are directories.
export const fileSystem = {
  '~': {
    'about.md': '# David Portfolio\n\nHello, I am a creative developer...',
    'projects': {
      'project1.md': '## Project 1\n\nDetails about my first cool project.',
      'project2.md': '## Project 2\n\nDetails about my second cool project.'
    },
    'contact.txt': 'You can reach me at email@example.com',
  }
};

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private fs: any = fileSystem;
  private currentPath: string[] = ['~'];

  constructor() { }

  public listDirectory(path: string[]): string[] {
    const dir = this.getDirectory(path);
    return dir ? Object.keys(dir) : [];
  }

  public getFileContent(path: string[]): string | null {
    const dir = this.getDirectory(path.slice(0, -1));
    const fileName = path[path.length - 1];
    if (dir && typeof dir[fileName] === 'string') {
      return dir[fileName];
    }
    return null;
  }

  // Helper to navigate the fs object
  private getDirectory(path: string[]): any {
    let current = this.fs;
    for (const part of path) {
      if (current[part] && typeof current[part] === 'object') {
        current = current[part];
      } else {
        return null; // Path not found or is a file
      }
    }
    return current;
  }
}