// src/app/services/shell.service.ts
import { Injectable } from '@angular/core';
import { FileSystemService } from './file-system.service';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  constructor(private fs: FileSystemService) { }

  public executeCommand(command: string): string {
    const [cmd, ...args] = command.trim().split(' ');

    switch (cmd) {
      case 'ls':
        // For simplicity, we'll just list the root for now
        return this.fs.listDirectory(['~']).join('   ');
      case 'cat':
        if (args.length === 0) {
          return 'Usage: cat [filename]';
        }
        const content = this.fs.getFileContent(['~', args[0]]);
        return content || `cat: ${args[0]}: No such file or directory`;
      case 'help':
        return 'Available commands: ls, cat, help, clear';
      case 'clear':
        return 'COMMAND_CLEAR_SCREEN'; // Special command for the UI
      default:
        return `bash: command not found: ${cmd}`;
    }
  }
}