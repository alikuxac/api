import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';

import {
  ApiKeyInfomationSuccess,
  ApiKeyInfomationFailed,
  ApiKeyInfomationRateLimit,
  SpecificPlayerSuccess,
  SpecificPlayerBadRequest,
  SpecificPlayerFailed,
  SpecificPlayerRateLimit,
  PlayerFriendsSuccess,
  PlayerFriendsBadRequest,
  PlayerFriendsFailed,
  PlayerFriendsRateLimit,
  PlayerFriendsForbidden,
  PlayerFriendsUnprocessableEntity,
  RecentGamesSuccess,
  RecentGamesBadRequest,
  RecentGamesFailed,
  RecentGamesRateLimit,
  RecentGamesForbidden,
  RecentGamesUnprocessableEntity,
  PlayerOnlineStatusSuccess,
  PlayerOnlineStatusBadRequest,
  PlayerOnlineStatusFailed,
  PlayerOnlineStatusRateLimit,
  RetrieveGuildSuccess,
  RetrieveGuildBadRequest,
  RetrieveGuildFailed,
  RetrieveGuildRateLimit,
  RetrieveGuildForbidden,
} from '@hypixel/response';

@Injectable()
export class HypixelService {
  private readonly baseUrl = 'https://api.hypixel.net';
  private key: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.key = this.configService.get('HYPIXEL_KEY');
  }

  private headers() {
    return {
      'X-API-Key': this.key,
    };
  }

  async getApiKeyInfomation() {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/key`, {
          headers: this.headers(),
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as ApiKeyInfomationSuccess;
              case 403:
                return res.data as ApiKeyInfomationFailed;
              case 429:
                return res.data as ApiKeyInfomationRateLimit;
              default:
                return res.data as ApiKeyInfomationFailed;
            }
          }),
        ),
    );
    return responseData;
  }

  async getSpecificPlayer(uuid: string) {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/player`, {
          headers: this.headers(),
          params: { uuid },
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as SpecificPlayerSuccess;
              case 400:
                return res.data as SpecificPlayerBadRequest;
              case 429:
                return res.data as SpecificPlayerRateLimit;
              default:
                return res.data as SpecificPlayerFailed;
            }
          }),
        ),
    );
    return responseData;
  }

  async getFriend(uuid: string) {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/friends`, {
          headers: this.headers(),
          params: { uuid },
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as PlayerFriendsSuccess;
              case 400:
                return res.data as PlayerFriendsBadRequest;
              case 403:
                return res.data as PlayerFriendsForbidden;
              case 422:
                return res.data as PlayerFriendsUnprocessableEntity;
              case 429:
                return res.data as PlayerFriendsRateLimit;
              default:
                return res.data as PlayerFriendsFailed;
            }
          }),
        ),
    );
    return responseData;
  }

  async getRecentGames(uuid: string) {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/recentgames`, {
          headers: this.headers(),
          params: { uuid },
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as RecentGamesSuccess;
              case 400:
                return res.data as RecentGamesBadRequest;
              case 403:
                return res.data as RecentGamesForbidden;
              case 422:
                return res.data as RecentGamesUnprocessableEntity;
              case 429:
                return res.data as RecentGamesRateLimit;
              default:
                return res.data as RecentGamesFailed;
            }
          }),
        ),
    );
    return responseData;
  }

  async getPlayerOnlineStatus(uuid: string) {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/player`, {
          headers: this.headers(),
          params: { uuid },
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as PlayerOnlineStatusSuccess;
              case 400:
                return res.data as PlayerOnlineStatusBadRequest;
              case 429:
                return res.data as PlayerOnlineStatusRateLimit;
              default:
                return res.data as PlayerOnlineStatusFailed;
            }
          }),
        ),
    );
    return responseData;
  }

  async getGuild(id: string, player: string, name: string) {
    const responseData = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/guild`, {
          headers: this.headers(),
          params: { id, player, name },
        })
        .pipe(
          map((res) => {
            switch (res.status) {
              case 200:
                return res.data as RetrieveGuildSuccess;
              case 400:
                return res.data as RetrieveGuildBadRequest;
              case 403:
                return res.data as RetrieveGuildForbidden;
              case 429:
                return res.data as RetrieveGuildRateLimit;
              default:
                return res.data as RetrieveGuildFailed;
            }
          }),
        ),
    );
    return responseData;
  }
}
