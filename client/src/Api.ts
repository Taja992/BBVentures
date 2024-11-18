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

export interface AccessTokenResponse {
  tokenType?: string | null;
  accessToken?: string | null;
  /** @format int64 */
  expiresIn?: number;
  refreshToken?: string | null;
}

export interface AspNetRole {
  id?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  name?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  normalizedName?: string | null;
  concurrencyStamp?: string | null;
  aspNetRoleClaims?: AspNetRoleClaim[] | null;
  users?: AspNetUser[] | null;
}

export interface AspNetRoleClaim {
  /** @format int32 */
  id?: number;
  roleId?: string | null;
  claimType?: string | null;
  claimValue?: string | null;
  role?: AspNetRole;
}

export interface AspNetUser {
  id?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  userName?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  normalizedUserName?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  email?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
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
  aspNetUserClaims?: AspNetUserClaim[] | null;
  aspNetUserLogins?: AspNetUserLogin[] | null;
  aspNetUserTokens?: AspNetUserToken[] | null;
  player?: Player;
  roles?: AspNetRole[] | null;
}

export interface AspNetUserClaim {
  /** @format int32 */
  id?: number;
  userId?: string | null;
  claimType?: string | null;
  claimValue?: string | null;
  user?: AspNetUser;
}

export interface AspNetUserLogin {
  loginProvider?: string | null;
  providerKey?: string | null;
  providerDisplayName?: string | null;
  userId?: string | null;
  user?: AspNetUser;
}

export interface AspNetUserToken {
  userId?: string | null;
  loginProvider?: string | null;
  name?: string | null;
  value?: string | null;
  user?: AspNetUser;
}

export interface Board {
  /** @format uuid */
  id?: string;
  playerId?: string | null;
  /** @format uuid */
  gameId?: string;
  numbers?: string[] | null;
  isAutoplay?: boolean;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  game?: Game;
  player?: Player;
}

export interface ForgotPasswordRequest {
  email?: string | null;
}

export interface Game {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  endedAt?: string | null;
  winnerNumbers?: string[] | null;
  /** @format double */
  totalRevenue?: number;
  boards?: Board[] | null;
}

export interface HttpValidationProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface InfoRequest {
  newEmail?: string | null;
  newPassword?: string | null;
  oldPassword?: string | null;
}

export interface InfoResponse {
  email?: string | null;
  isEmailConfirmed?: boolean;
}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

export interface Player {
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
  userId?: string | null;
  isActive?: boolean;
  /** @format double */
  balance?: number;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  updatedAt?: string | null;
  boards?: Board[] | null;
  transactions?: Transaction[] | null;
  user?: AspNetUser;
}

export interface RefreshRequest {
  refreshToken?: string | null;
}

export interface RegisterRequest {
  email?: string | null;
  password?: string | null;
}

export interface ResendConfirmationEmailRequest {
  email?: string | null;
}

export interface ResetPasswordRequest {
  email?: string | null;
  resetCode?: string | null;
  newPassword?: string | null;
}

export interface Transaction {
  /** @format uuid */
  id?: string;
  playerId?: string | null;
  /** @format double */
  amount?: number;
  /** @format date-time */
  createdAt?: string | null;
  mobilePayTransactionNumber?: string | null;
  player?: Player;
}

export interface TwoFactorRequest {
  enable?: boolean | null;
  twoFactorCode?: string | null;
  resetSharedKey?: boolean;
  resetRecoveryCodes?: boolean;
  forgetMachine?: boolean;
}

export interface TwoFactorResponse {
  sharedKey?: string | null;
  /** @format int32 */
  recoveryCodesLeft?: number;
  recoveryCodes?: string[] | null;
  isTwoFactorEnabled?: boolean;
  isMachineRemembered?: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  register = {
    /**
     * No description
     *
     * @tags API
     * @name RegisterCreate
     * @request POST:/register
     */
    registerCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<void, HttpValidationProblemDetails>({
        path: `/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags API
     * @name LoginCreate
     * @request POST:/login
     */
    loginCreate: (
      data: LoginRequest,
      query?: {
        useCookies?: boolean;
        useSessionCookies?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<AccessTokenResponse, any>({
        path: `/login`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  refresh = {
    /**
     * No description
     *
     * @tags API
     * @name RefreshCreate
     * @request POST:/refresh
     */
    refreshCreate: (data: RefreshRequest, params: RequestParams = {}) =>
      this.request<AccessTokenResponse, any>({
        path: `/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  confirmEmail = {
    /**
     * No description
     *
     * @tags API
     * @name MapIdentityApiConfirmEmail
     * @request GET:/confirmEmail
     */
    mapIdentityApiConfirmEmail: (
      query?: {
        userId?: string;
        code?: string;
        changedEmail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/confirmEmail`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  resendConfirmationEmail = {
    /**
     * No description
     *
     * @tags API
     * @name ResendConfirmationEmailCreate
     * @request POST:/resendConfirmationEmail
     */
    resendConfirmationEmailCreate: (data: ResendConfirmationEmailRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/resendConfirmationEmail`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  forgotPassword = {
    /**
     * No description
     *
     * @tags API
     * @name ForgotPasswordCreate
     * @request POST:/forgotPassword
     */
    forgotPasswordCreate: (data: ForgotPasswordRequest, params: RequestParams = {}) =>
      this.request<void, HttpValidationProblemDetails>({
        path: `/forgotPassword`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  resetPassword = {
    /**
     * No description
     *
     * @tags API
     * @name ResetPasswordCreate
     * @request POST:/resetPassword
     */
    resetPasswordCreate: (data: ResetPasswordRequest, params: RequestParams = {}) =>
      this.request<void, HttpValidationProblemDetails>({
        path: `/resetPassword`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  manage = {
    /**
     * No description
     *
     * @tags API
     * @name PostManage
     * @request POST:/manage/2fa
     */
    postManage: (data: TwoFactorRequest, params: RequestParams = {}) =>
      this.request<TwoFactorResponse, HttpValidationProblemDetails | void>({
        path: `/manage/2fa`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags API
     * @name InfoList
     * @request GET:/manage/info
     */
    infoList: (params: RequestParams = {}) =>
      this.request<InfoResponse, HttpValidationProblemDetails | void>({
        path: `/manage/info`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags API
     * @name InfoCreate
     * @request POST:/manage/info
     */
    infoCreate: (data: InfoRequest, params: RequestParams = {}) =>
      this.request<InfoResponse, HttpValidationProblemDetails | void>({
        path: `/manage/info`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @tags Board
     * @name BoardList
     * @request GET:/api/board
     */
    boardList: (params: RequestParams = {}) =>
      this.request<Board[], any>({
        path: `/api/board`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardCreate
     * @request POST:/api/board
     */
    boardCreate: (
      query?: {
        /** @format uuid */
        Id?: string;
        PlayerId?: string;
        /** @format uuid */
        GameId?: string;
        Numbers?: string[];
        IsAutoplay?: boolean;
        /** @format date-time */
        CreatedAt?: string;
        /** @format date-time */
        UpdatedAt?: string;
        /** @format uuid */
        gameId?: string;
        /** @format date-time */
        gameCreatedAt?: string;
        /** @format date-time */
        gameEndedAt?: string;
        gameWinnerNumbers?: string[];
        /** @format double */
        gameTotalRevenue?: number;
        gameBoards?: Board[];
        playerUserId?: string;
        playerIsActive?: boolean;
        /** @format double */
        playerBalance?: number;
        /** @format date-time */
        playerCreatedAt?: string;
        /** @format date-time */
        playerUpdatedAt?: string;
        playerBoards?: Board[];
        playerTransactions?: Transaction[];
        /**
         * @minLength 0
         * @maxLength 256
         */
        playerUserUserName?: string;
        /**
         * @minLength 0
         * @maxLength 256
         */
        playerUserNormalizedUserName?: string;
        /**
         * @minLength 0
         * @maxLength 256
         */
        playerUserEmail?: string;
        /**
         * @minLength 0
         * @maxLength 256
         */
        playerUserNormalizedEmail?: string;
        playerUserEmailConfirmed?: boolean;
        playerUserPasswordHash?: string;
        playerUserSecurityStamp?: string;
        playerUserConcurrencyStamp?: string;
        playerUserPhoneNumber?: string;
        playerUserPhoneNumberConfirmed?: boolean;
        playerUserTwoFactorEnabled?: boolean;
        /** @format date-time */
        playerUserLockoutEnd?: string;
        playerUserLockoutEnabled?: boolean;
        /** @format int32 */
        playerUserAccessFailedCount?: number;
        playerUserAspNetUserClaims?: AspNetUserClaim[];
        playerUserAspNetUserLogins?: AspNetUserLogin[];
        playerUserAspNetUserTokens?: AspNetUserToken[];
        playerUserPlayerUserId?: string;
        playerUserPlayerIsActive?: boolean;
        /** @format double */
        playerUserPlayerBalance?: number;
        /** @format date-time */
        playerUserPlayerCreatedAt?: string;
        /** @format date-time */
        playerUserPlayerUpdatedAt?: string;
        playerUserPlayerBoards?: Board[];
        playerUserPlayerTransactions?: Transaction[];
        playerUserPlayerUser?: AspNetUser;
        playerUserPlayerId?: string;
        playerUserPlayerUserName?: string;
        playerUserPlayerNormalizedUserName?: string;
        playerUserPlayerEmail?: string;
        playerUserPlayerNormalizedEmail?: string;
        playerUserPlayerEmailConfirmed?: boolean;
        playerUserPlayerPasswordHash?: string;
        playerUserPlayerSecurityStamp?: string;
        playerUserPlayerConcurrencyStamp?: string;
        playerUserPlayerPhoneNumber?: string;
        playerUserPlayerPhoneNumberConfirmed?: boolean;
        playerUserPlayerTwoFactorEnabled?: boolean;
        /** @format date-time */
        playerUserPlayerLockoutEnd?: string;
        playerUserPlayerLockoutEnabled?: boolean;
        /** @format int32 */
        playerUserPlayerAccessFailedCount?: number;
        playerUserRoles?: AspNetRole[];
        playerId?: string;
        playerUserName?: string;
        playerNormalizedUserName?: string;
        playerEmail?: string;
        playerNormalizedEmail?: string;
        playerEmailConfirmed?: boolean;
        playerPasswordHash?: string;
        playerSecurityStamp?: string;
        playerConcurrencyStamp?: string;
        playerPhoneNumber?: string;
        playerPhoneNumberConfirmed?: boolean;
        playerTwoFactorEnabled?: boolean;
        /** @format date-time */
        playerLockoutEnd?: string;
        playerLockoutEnabled?: boolean;
        /** @format int32 */
        playerAccessFailedCount?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Board, any>({
        path: `/api/board`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
