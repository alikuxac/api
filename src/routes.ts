import { Routes } from '@nestjs/core';

// Public Module
import { MinecraftModule } from '../public/minecraft/minecraft.module';
import { TextModule } from '../public/text/text.module';

export const routes: Routes = [
  {
    path: 'public',
    children: [
      {
        path: 'minecraft',
        module: MinecraftModule,
      },
      {
        path: 'text',
        module: TextModule,
      },
    ],
  },
];
