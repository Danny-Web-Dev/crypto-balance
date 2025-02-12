import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly colors = {
    log: '\x1b[32m',       // Green
    error: '\x1b[31m',     // Red
    warn: '\x1b[33m',      // Yellow
    debug: '\x1b[34m',     // Blue
    verbose: '\x1b[35m',   // Magenta
    reset: '\x1b[0m',
  };

  log(message: string) {
    console.log(`${this.colors.log}[LOG] ${message}${this.colors.reset}`);
  }

  error<T>(message: T, trace: string = '') {
    const messageStr = JSON.stringify(message);
    console.error(`${this.colors.error}[ERROR] ${messageStr} ${trace}${this.colors.reset}`);
  }

  warn(message: string) {
    console.warn(`${this.colors.warn}[WARN] ${message}${this.colors.reset}`);
  }

  debug(message: string) {
    console.debug(`${this.colors.debug}[DEBUG] ${message}${this.colors.reset}`);
  }

  verbose(message: string) {
    console.log(`${this.colors.verbose}[VERBOSE] ${message}${this.colors.reset}`);
  }
}
