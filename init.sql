create table "AspNetRoles"
(
    "Id"               text not null
        constraint "PK_AspNetRoles"
            primary key,
    "Name"             varchar(256),
    "NormalizedName"   varchar(256),
    "ConcurrencyStamp" text
);

alter table "AspNetRoles"
    owner to postgres;

create unique index "RoleNameIndex"
    on "AspNetRoles" ("NormalizedName");

create table "AspNetUsers"
(
    "Id"                   text    not null
        constraint "PK_AspNetUsers"
            primary key,
    "IsActive"             boolean not null,
    "Balance"              numeric not null,
    "CreatedAt"            timestamp with time zone,
    "UpdatedAt"            timestamp with time zone,
    "UserName"             varchar(256),
    "NormalizedUserName"   varchar(256),
    "Email"                varchar(256),
    "NormalizedEmail"      varchar(256),
    "EmailConfirmed"       boolean not null,
    "PasswordHash"         text,
    "SecurityStamp"        text,
    "ConcurrencyStamp"     text,
    "PhoneNumber"          text,
    "PhoneNumberConfirmed" boolean not null,
    "TwoFactorEnabled"     boolean not null,
    "LockoutEnd"           timestamp with time zone,
    "LockoutEnabled"       boolean not null,
    "AccessFailedCount"    integer not null
);

alter table "AspNetUsers"
    owner to postgres;

create index "EmailIndex"
    on "AspNetUsers" ("NormalizedEmail");

create unique index "UserNameIndex"
    on "AspNetUsers" ("NormalizedUserName");

create table "Games"
(
    "Id"            uuid    not null
        constraint "PK_Games"
            primary key,
    "WinnerNumbers" int[],
    "TotalRevenue"  numeric not null,
    "IsActive"      boolean not null,
    "WeekNumber"    integer not null
);

alter table "Games"
    owner to postgres;

create table "AspNetRoleClaims"
(
    "Id"         integer generated by default as identity
        constraint "PK_AspNetRoleClaims"
            primary key,
    "RoleId"     text not null
        constraint "FK_AspNetRoleClaims_AspNetRoles_RoleId"
            references "AspNetRoles"
            on delete cascade,
    "ClaimType"  text,
    "ClaimValue" text
);

alter table "AspNetRoleClaims"
    owner to postgres;

create index "IX_AspNetRoleClaims_RoleId"
    on "AspNetRoleClaims" ("RoleId");

create table "AspNetUserClaims"
(
    "Id"         integer generated by default as identity
        constraint "PK_AspNetUserClaims"
            primary key,
    "UserId"     text not null
        constraint "FK_AspNetUserClaims_AspNetUsers_UserId"
            references "AspNetUsers"
            on delete cascade,
    "ClaimType"  text,
    "ClaimValue" text
);

alter table "AspNetUserClaims"
    owner to postgres;

create index "IX_AspNetUserClaims_UserId"
    on "AspNetUserClaims" ("UserId");

create table "AspNetUserLogins"
(
    "LoginProvider"       text not null,
    "ProviderKey"         text not null,
    "ProviderDisplayName" text,
    "UserId"              text not null
        constraint "FK_AspNetUserLogins_AspNetUsers_UserId"
            references "AspNetUsers"
            on delete cascade,
    constraint "PK_AspNetUserLogins"
        primary key ("LoginProvider", "ProviderKey")
);

alter table "AspNetUserLogins"
    owner to postgres;

create index "IX_AspNetUserLogins_UserId"
    on "AspNetUserLogins" ("UserId");

create table "AspNetUserRoles"
(
    "UserId" text not null
        constraint "FK_AspNetUserRoles_AspNetUsers_UserId"
            references "AspNetUsers"
            on delete cascade,
    "RoleId" text not null
        constraint "FK_AspNetUserRoles_AspNetRoles_RoleId"
            references "AspNetRoles"
            on delete cascade,
    constraint "PK_AspNetUserRoles"
        primary key ("UserId", "RoleId")
);

alter table "AspNetUserRoles"
    owner to postgres;

create index "IX_AspNetUserRoles_RoleId"
    on "AspNetUserRoles" ("RoleId");

create table "AspNetUserTokens"
(
    "UserId"        text not null
        constraint "FK_AspNetUserTokens_AspNetUsers_UserId"
            references "AspNetUsers"
            on delete cascade,
    "LoginProvider" text not null,
    "Name"          text not null,
    "Value"         text,
    constraint "PK_AspNetUserTokens"
        primary key ("UserId", "LoginProvider", "Name")
);

alter table "AspNetUserTokens"
    owner to postgres;

create table "Transactions"
(
    "Id"                         uuid    not null
        constraint "PK_Transactions"
            primary key,
    "PlayerId"                   text    not null
        constraint "FK_Transactions_AspNetUsers_PlayerId"
            references "AspNetUsers"
            on delete cascade,
    "Amount"                     numeric not null,
    "CreatedAt"                  timestamp with time zone,
    "MobilePayTransactionNumber" text
);

alter table "Transactions"
    owner to postgres;

create index "IX_Transactions_PlayerId"
    on "Transactions" ("PlayerId");

create table "Boards"
(
    "Id"         uuid    not null
        constraint "PK_Boards"
            primary key,
    "PlayerId"   text    not null
        constraint "FK_Boards_AspNetUsers_PlayerId"
            references "AspNetUsers"
            on delete cascade,
    "GameId"     uuid    not null
        constraint "FK_Boards_Games_GameId"
            references "Games"
            on delete cascade,
    "Numbers"    int[],
    "IsAutoplay" boolean not null,
    "CreatedAt"  timestamp with time zone,
    "UpdatedAt"  timestamp with time zone
);

alter table "Boards"
    owner to postgres;

create index "IX_Boards_GameId"
    on "Boards" ("GameId");

create index "IX_Boards_PlayerId"
    on "Boards" ("PlayerId");