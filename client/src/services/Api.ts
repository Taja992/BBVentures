/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BBVenturesApiAuthUserInfo {
  username?: string | null;
  isAdmin?: boolean;
  isPlayer?: boolean;
}

export interface BBVenturesApiBoard {
  /** @format uuid */
  id?: string;
  userId?: string | null;
  /** @format uuid */
  gameId?: string;
  numbers?: number[] | null;
  /** @format int32 */
  autoplayWeeks?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string | null;
  isWon?: boolean;
  game?: BBVenturesApiGame;
  user?: BBVenturesApiUser;
}

export interface BBVenturesApiBoardDto {
  /** @format uuid */
  id?: string;
  userId?: string | null;
  /** @format uuid */
  gameId?: string;
  numbers?: number[] | null;
  /** @format int32 */
  autoplayWeeks?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string | null;
  isWon?: boolean;
  /** @format int32 */
  weekNumber?: number;
  playerUsername?: string | null;
  playerEmail?: string | null;
}

export interface BBVenturesApiBoardHistoryDto {
  numbers?: number[] | null;
  /** @format date-time */
  createdAt?: string;
  /** @format int32 */
  weekNumber?: number;
}

export interface BBVenturesApiCreateBoardDto {
  userId?: string | null;
  /** @format uuid */
  gameId?: string;
  numbers?: number[] | null;
  isAutoplay?: boolean;
  /** @format int32 */
  autoplayWeeks?: number;
  /** @format int32 */
  fieldCount?: number;
}

export interface BBVenturesApiGame {
  /** @format uuid */
  id?: string;
  winnerNumbers?: number[] | null;
  isActive?: boolean;
  /** @format int32 */
  weekNumber?: number;
  /** @format date-time */
  endedAt?: string | null;
  /** @format int32 */
  winners?: number;
  /** @format double */
  totalRevenue?: number;
  /** @format double */
  clubRevenue?: number;
  /** @format double */
  winnersRevenue?: number;
  /** @format double */
  winnerShare?: number;
  winnersUserId?: string[] | null;
  boards?: BBVenturesApiBoard[] | null;
}

export interface BBVenturesApiGameDto {
  /** @format uuid */
  id?: string;
  winnerNumbers?: number[] | null;
  /** @format double */
  totalRevenue?: number;
  isActive?: boolean;
  /** @format int32 */
  weekNumber?: number;
  /** @format double */
  clubRevenue?: number;
  /** @format double */
  winnersRevenue?: number;
  /** @format int32 */
  winners?: number;
  winnerUsernames?: string[] | null;
  winnerEmails?: string[] | null;
  winnersUserId?: string[] | null;
  individualWinnings?: number[] | null;
}

export interface BBVenturesApiLoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface BBVenturesApiLoginResponse {
  jwt?: string | null;
}

export interface BBVenturesApiPasswordResetRequest {
  email?: string | null;
}

export interface BBVenturesApiRegisterPasswordRequest {
  email?: string | null;
  emailConfirmationToken?: string | null;
  passwordResetToken?: string | null;
  newPassword?: string | null;
}

export interface BBVenturesApiRegisterRequest {
  email?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
}

export interface BBVenturesApiRegisterResponse {
  email?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
}

export interface BBVenturesApiRoleAssignmentRequest {
  userId?: string | null;
  role?: string | null;
}

export interface BBVenturesApiTransaction {
  /** @format uuid */
  id?: string;
  userId?: string | null;
  /** @format double */
  amount?: number;
  /** @format date-time */
  createdAt?: string | null;
  mobilePayTransactionNumber?: string | null;
  isPending?: boolean;
  user?: BBVenturesApiUser;
}

export interface BBVenturesApiTransactionDto {
  userId?: string | null;
  /** @format double */
  amount?: number;
  mobilePayTransactionNumber?: string | null;
  isPending?: boolean;
}

export interface BBVenturesApiTransactionResponseDto {
  /** @format uuid */
  id?: string;
  userId?: string | null;
  /** @format double */
  amount?: number;
  /** @format date-time */
  createdAt?: string | null;
  mobilePayTransactionNumber?: string | null;
  isPending?: boolean;
}

export interface BBVenturesApiUser {
  id?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  passwordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  /** @format date-time */
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  /** @format int32 */
  accessFailedCount?: number;
  isActive?: boolean;
  /** @format double */
  balance?: number;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  boards?: BBVenturesApiBoard[] | null;
  transactions?: BBVenturesApiTransaction[] | null;
}

export interface BBVenturesApiUserDto {
  id?: string | null;
  isActive?: boolean;
  /** @format double */
  balance?: number;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  phoneNumber?: string | null;
  role?: string | null;
}

export interface MicrosoftIdentityResetPasswordRequest {
  email?: string | null;
  resetCode?: string | null;
  newPassword?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/Auth/login
     */
    authLoginCreate: (data: BBVenturesApiLoginRequest, params: RequestParams = {}) =>
      this.request<BBVenturesApiLoginResponse, any>({
        path: `/api/Auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegisterCreate
     * @request POST:/api/Auth/register
     */
    authRegisterCreate: (data: BBVenturesApiRegisterRequest, params: RequestParams = {}) =>
      this.request<BBVenturesApiRegisterResponse, any>({
        path: `/api/Auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegisterPasswordCreate
     * @request POST:/api/Auth/register-password
     */
    authRegisterPasswordCreate: (data: BBVenturesApiRegisterPasswordRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/register-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRequestResetPasswordCreate
     * @request POST:/api/Auth/request-reset-password
     */
    authRequestResetPasswordCreate: (data: BBVenturesApiPasswordResetRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/request-reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthResetPasswordCreate
     * @request POST:/api/Auth/reset-password
     */
    authResetPasswordCreate: (data: MicrosoftIdentityResetPasswordRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogoutCreate
     * @request POST:/api/Auth/logout
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthUserinfoList
     * @request GET:/api/Auth/userinfo
     */
    authUserinfoList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiAuthUserInfo, any>({
        path: `/api/Auth/userinfo`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthMeList
     * @request GET:/api/Auth/me
     */
    authMeList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiUser, any>({
        path: `/api/Auth/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardList
     * @request GET:/api/Board
     */
    boardList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiBoardDto[], any>({
        path: `/api/Board`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardCreateCreate
     * @request POST:/api/Board/create
     */
    boardCreateCreate: (data: BBVenturesApiCreateBoardDto, params: RequestParams = {}) =>
      this.request<BBVenturesApiBoardDto, any>({
        path: `/api/Board/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardUserBoardHistoryList
     * @request GET:/api/Board/user-board-history
     */
    boardUserBoardHistoryList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiBoardHistoryDto[], any>({
        path: `/api/Board/user-board-history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardGetBoardsFromThisWeekList
     * @request GET:/api/Board/get-boards-from-this-week
     */
    boardGetBoardsFromThisWeekList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiBoardDto[], any>({
        path: `/api/Board/get-boards-from-this-week`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameList
     * @request GET:/api/Game
     */
    gameList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiGameDto[], any>({
        path: `/api/Game`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameProcessWinningNumbersCreate
     * @request POST:/api/Game/processWinningNumbers
     */
    gameProcessWinningNumbersCreate: (data: number[], params: RequestParams = {}) =>
      this.request<BBVenturesApiGameDto, any>({
        path: `/api/Game/processWinningNumbers`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionGetTransactionsList
     * @request GET:/api/Transaction/getTransactions
     */
    transactionGetTransactionsList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiTransactionResponseDto[], any>({
        path: `/api/Transaction/getTransactions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionTransactionsFromUserList
     * @request GET:/api/Transaction/transactionsFromUser
     */
    transactionTransactionsFromUserList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiTransactionResponseDto[], any>({
        path: `/api/Transaction/transactionsFromUser`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionTransactionsFromNameList
     * @request GET:/api/Transaction/transactionsFromName
     */
    transactionTransactionsFromNameList: (
      query?: {
        searchVal?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BBVenturesApiTransactionResponseDto[], any>({
        path: `/api/Transaction/transactionsFromName`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionAddTransactionCreate
     * @request POST:/api/Transaction/addTransaction
     */
    transactionAddTransactionCreate: (data: BBVenturesApiTransactionDto, params: RequestParams = {}) =>
      this.request<BBVenturesApiTransaction, any>({
        path: `/api/Transaction/addTransaction`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionUpdateTransactionUpdate
     * @request PUT:/api/Transaction/updateTransaction
     */
    transactionUpdateTransactionUpdate: (data: BBVenturesApiTransactionResponseDto, params: RequestParams = {}) =>
      this.request<BBVenturesApiTransactionDto, any>({
        path: `/api/Transaction/updateTransaction`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGetallList
     * @request GET:/api/User/getall
     */
    userGetallList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiUserDto[], any>({
        path: `/api/User/getall`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGetWithNameList
     * @request GET:/api/User/getWithName
     */
    userGetWithNameList: (
      query?: {
        searchVal?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BBVenturesApiUserDto[], any>({
        path: `/api/User/getWithName`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGetByIdList
     * @request GET:/api/User/getById
     */
    userGetByIdList: (
      query?: {
        id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<BBVenturesApiUserDto, any>({
        path: `/api/User/getById`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserUpdateUpdate
     * @request PUT:/api/User/update
     */
    userUpdateUpdate: (data: BBVenturesApiUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserUpdateSelfUpdate
     * @request PUT:/api/User/update-self
     */
    userUpdateSelfUpdate: (data: BBVenturesApiUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/update-self`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserUpdateBalanceUpdate
     * @request PUT:/api/User/updateBalance
     */
    userUpdateBalanceUpdate: (
      query?: {
        id?: string;
        /** @format double */
        transactionAmount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/User/updateBalance`,
        method: "PUT",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserAssignRoleCreate
     * @request POST:/api/User/assign-role
     */
    userAssignRoleCreate: (data: BBVenturesApiRoleAssignmentRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/assign-role`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
