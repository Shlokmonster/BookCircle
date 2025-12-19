# Postman Collection Setup

## How to Import

1. Open Postman
2. Click "Import" button
3. Select "Raw text" and paste the JSON below
4. Save as "BookCircle API"

## Collection JSON

```json
{
  "info": {
    "name": "BookCircle API",
    "description": "API endpoints for BookCircle book club platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.collectionVariables.set('token', response.token);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/auth/profile",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "profile"]
            }
          }
        }
      ]
    },
    {
      "name": "Clubs",
      "item": [
        {
          "name": "Create Club",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Sci-Fi Book Club\",\n  \"description\": \"We love science fiction!\",\n  \"isPrivate\": false,\n  \"maxMembers\": 20,\n  \"tags\": [\"sci-fi\", \"fiction\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/clubs",
              "host": ["{{baseUrl}}"],
              "path": ["clubs"]
            }
          }
        },
        {
          "name": "Get All Clubs",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/clubs?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["clubs"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get My Clubs",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/clubs/my-clubs",
              "host": ["{{baseUrl}}"],
              "path": ["clubs", "my-clubs"]
            }
          }
        },
        {
          "name": "Join Club",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"inviteCode\": \"ABC123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/clubs/64f8a1b2c3d4e5f6a7b8c9d0/join",
              "host": ["{{baseUrl}}"],
              "path": ["clubs", "64f8a1b2c3d4e5f6a7b8c9d0", "join"]
            }
          }
        }
      ]
    },
    {
      "name": "Books",
      "item": [
        {
          "name": "Add Book",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Dune\",\n  \"author\": \"Frank Herbert\",\n  \"description\": \"A classic science fiction novel\",\n  \"totalPages\": 688,\n  \"genre\": [\"science-fiction\", \"classic\"],\n  \"publishedYear\": 1965\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/books",
              "host": ["{{baseUrl}}"],
              "path": ["books"]
            }
          }
        },
        {
          "name": "Get All Books",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/books?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["books"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "20"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Votes",
      "item": [
        {
          "name": "Create Vote",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"clubId\": \"64f8a1b2c3d4e5f6a7b8c9d0\",\n  \"title\": \"Next Book Selection\",\n  \"description\": \"Choose our next book to read\",\n  \"votingOptions\": [\n    { \"book\": \"64f8a1b2c3d4e5f6a7b8c9d1\" },\n    { \"book\": \"64f8a1b2c3d4e5f6a7b8c9d2\" }\n  ],\n  \"endDate\": \"2024-02-01T00:00:00.000Z\",\n  \"votingType\": \"single\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/votes",
              "host": ["{{baseUrl}}"],
              "path": ["votes"]
            }
          }
        },
        {
          "name": "Cast Vote",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"bookId\": \"64f8a1b2c3d4e5f6a7b8c9d1\",\n  \"preference\": 1\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/votes/64f8a1b2c3d4e5f6a7b8c9d0/vote",
              "host": ["{{baseUrl}}"],
              "path": ["votes", "64f8a1b2c3d4e5f6a7b8c9d0", "vote"]
            }
          }
        }
      ]
    }
  ]
}
```

## Environment Variables

Create these environment variables in Postman:

```
baseUrl = http://localhost:3000/api
token = [will be set automatically after login]
```

## Usage

1. First, register a user or login
2. The token will be automatically stored and used for subsequent requests
3. Test each endpoint with the provided sample data
4. Modify the request body/data as needed for your testing
```
