## Create Admin Account
No API to create admin accounts for security

## Login

### HTTP Request

`POST /auth/login`

### Post Parameters

| Parameter | Required | Description        |
| --------- | -------- | ------------------ |
| email     | true     | Email.    |
| password  | true     | Password. |

&nbsp;

Sample in Shell

```shell
curl --request POST \
  --url /auth/login \
  --data '{\n "email" : "tesst@gmail.com",\n  "password" : "Abc12345"\n}'

```

Response

Will be a cookie
## Get user info - check if still logged in

### HTTP Request

`GET /auth/me`

Sample in Shell

```shell
curl --request GET \
  --url /auth/me \

```

Response

```json
{
    "deleted": false,
    "_id": "6123de903206df7a842aa160",
    "email": "mwieder@evelt.com",
    "lastLogOut": "2021-08-26T19:38:03.501Z",
    "createdAt": "2021-08-23T17:44:48.915Z",
    "updatedAt": "2021-08-26T19:38:03.503Z",
    "__v": 0,
    "id": "6123de903206df7a842aa160"
}
```

## Lgout

### HTTP Request

`POST /auth/logout`

### Post Parameters

| Parameter | Required | Description        |
| --------- | -------- | ------------------ |

&nbsp;

Sample in Shell

```shell
curl --request POST \
  --url /auth/logout \

```

Response

Will be a cookie
