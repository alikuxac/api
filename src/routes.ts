import type { Routes } from '@nestjs/core';

// Public Module
import { MinecraftModule } from '@modules/public/minecraft/minecraft.module';
import { TextModule } from '@modules/public/text/text.module';
import { HypixelModule } from '@modules/hypixel/hypixel.module';

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
  {
    path: 'hypixel',
    module: HypixelModule,
  },
];
