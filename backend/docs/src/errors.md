## Error

### Error shape 

```json
{
    "error":{
        "message":"some error"
        ,"field":"Sometimes, this will be filled as well"
    }
}
```
### Response Codes
| Code    | Description  |
|---------- | --------------|
| 500 | Server Error        |
| 400 | An  Error on your end        |
| 401 | unauthorized        |
| 404 | something in request is not found, let's say you sent an ObjectId that does not exists        |



