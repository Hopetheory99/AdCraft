import { Injectable } from '@nestjs/common';

export interface ServiceMap {
  [key: string]: string;
}

@Injectable()
export class ServiceRegistry {
  private services: ServiceMap = {};

  constructor() {
    const env = process.env.SERVICE_MAP;
    if (env) {
      try {
        this.services = JSON.parse(env);
      } catch (e) {
        console.error('Invalid SERVICE_MAP', e);
      }
    }
  }

  get(name: string): string | undefined {
    return this.services[name];
  }
}
