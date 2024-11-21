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

export interface BBVenturesApiDataAccessModelsBoard {
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
  game?: BBVenturesApiDataAccessModelsGame;
  player?: BBVenturesApiDataAccessModelsPlayer;
}

export interface BBVenturesApiDataAccessModelsGame {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  createdAt?: string | null;
  /** @format date-time */
  endedAt?: string | null;
  winnerNumbers?: string[] | null;
  /** @format double */
  totalRevenue?: number;
  boards?: BBVenturesApiDataAccessModelsBoard[] | null;
}

export interface BBVenturesApiDataAccessModelsPlayer {
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
  boards?: BBVenturesApiDataAccessModelsBoard[] | null;
  transactions?: BBVenturesApiDataAccessModelsTransaction[] | null;
}

export interface BBVenturesApiDataAccessModelsTransaction {
  /** @format uuid */
  id?: string;
  playerId?: string | null;
  /** @format double */
  amount?: number;
  /** @format date-time */
  createdAt?: string | null;
  mobilePayTransactionNumber?: string | null;
  player?: BBVenturesApiDataAccessModelsPlayer;
}

export interface BBVenturesApiLoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface BBVenturesApiLoginResponse {
  jwt?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreAuthenticationBearerTokenAccessTokenResponse {
  tokenType?: string | null;
  accessToken?: string | null;
  /** @format int64 */
  expiresIn?: number;
  refreshToken?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataForgotPasswordRequest {
  email?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataInfoRequest {
  newEmail?: string | null;
  newPassword?: string | null;
  oldPassword?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataInfoResponse {
  email?: string | null;
  isEmailConfirmed?: boolean;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataLoginRequest {
  email?: string | null;
  password?: string | null;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataRefreshRequest {
  refreshToken?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataRegisterRequest {
  email?: string | null;
  password?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataResendConfirmationEmailRequest {
  email?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataResetPasswordRequest {
  email?: string | null;
  resetCode?: string | null;
  newPassword?: string | null;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataTwoFactorRequest {
  enable?: boolean | null;
  twoFactorCode?: string | null;
  resetSharedKey?: boolean;
  resetRecoveryCodes?: boolean;
  forgetMachine?: boolean;
}

export interface BBVenturesApiMicrosoftAspNetCoreIdentityDataTwoFactorResponse {
  sharedKey?: string | null;
  /** @format int32 */
  recoveryCodesLeft?: number;
  recoveryCodes?: string[] | null;
  isTwoFactorEnabled?: boolean;
  isMachineRemembered?: boolean;
}

export interface BBVenturesApiRegisterRequest {
  email?: string | null;
  password?: string | null;
  name?: string | null;
}

export interface BBVenturesApiRegisterResponse {
  email?: string | null;
  name?: string | null;
}

export interface BBVenturesApiServiceTransferModelsDTOsTransactionDto {
  playerId?: string | null;
  /** @format double */
  amount?: number;
  mobilePayTransactionNumber?: string | null;
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
  register = {
    /**
     * No description
     *
     * @tags API
     * @name RegisterCreate
     * @request POST:/register
     */
    registerCreate: (data: BBVenturesApiMicrosoftAspNetCoreIdentityDataRegisterRequest, params: RequestParams = {}) =>
      this.request<void, BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails>({
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
      data: BBVenturesApiMicrosoftAspNetCoreIdentityDataLoginRequest,
      query?: {
        useCookies?: boolean;
        useSessionCookies?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<BBVenturesApiMicrosoftAspNetCoreAuthenticationBearerTokenAccessTokenResponse, any>({
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
    refreshCreate: (data: BBVenturesApiMicrosoftAspNetCoreIdentityDataRefreshRequest, params: RequestParams = {}) =>
      this.request<BBVenturesApiMicrosoftAspNetCoreAuthenticationBearerTokenAccessTokenResponse, any>({
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
    resendConfirmationEmailCreate: (
      data: BBVenturesApiMicrosoftAspNetCoreIdentityDataResendConfirmationEmailRequest,
      params: RequestParams = {},
    ) =>
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
    forgotPasswordCreate: (
      data: BBVenturesApiMicrosoftAspNetCoreIdentityDataForgotPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails>({
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
    resetPasswordCreate: (
      data: BBVenturesApiMicrosoftAspNetCoreIdentityDataResetPasswordRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails>({
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
    postManage: (data: BBVenturesApiMicrosoftAspNetCoreIdentityDataTwoFactorRequest, params: RequestParams = {}) =>
      this.request<
        BBVenturesApiMicrosoftAspNetCoreIdentityDataTwoFactorResponse,
        BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails | void
      >({
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
      this.request<
        BBVenturesApiMicrosoftAspNetCoreIdentityDataInfoResponse,
        BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails | void
      >({
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
    infoCreate: (data: BBVenturesApiMicrosoftAspNetCoreIdentityDataInfoRequest, params: RequestParams = {}) =>
      this.request<
        BBVenturesApiMicrosoftAspNetCoreIdentityDataInfoResponse,
        BBVenturesApiMicrosoftAspNetCoreHttpHttpValidationProblemDetails | void
      >({
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
     * @tags Board
     * @name BoardList
     * @request GET:/api/board
     */
    boardList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiDataAccessModelsBoard[], any>({
        path: `/api/board`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionsList
     * @request GET:/api/transactions
     */
    transactionsList: (params: RequestParams = {}) =>
      this.request<BBVenturesApiDataAccessModelsTransaction[], any>({
        path: `/api/transactions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name AddTransactionCreate
     * @request POST:/api/addTransaction
     */
    addTransactionCreate: (data: BBVenturesApiServiceTransferModelsDTOsTransactionDto, params: RequestParams = {}) =>
      this.request<BBVenturesApiServiceTransferModelsDTOsTransactionDto, any>({
        path: `/api/addTransaction`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
