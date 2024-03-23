## Filter

Let's take for example the Customer List. We use the [qs](https://www.npmjs.com/package/qs) package to parse Query Params. 

Example Filter: You can filter by any field:

```
GET /customers?firstName=m&lastName=green
```
you can also use any mongo operator, like the `$ne` (not equal) operator. Her since it's an inner object, we user `qs.stringify`
```
qs.stringify({
    firstName: {
        $ne: "m"
    }
})
```
The object passed in to `qs.stirngify` will output: 
```
GET /customers?firstName[$ne]=
```

## Select
you can also select certain fields with a space seperated list
```
GET /customers?select=firstName lastName
```
you can also select everything EXCEPT certain fields by adding the `-` sign before that field name
```
GET /customers?select=-firstName -lastName
```

## Sort
You can sort on any field, or multiple fields. Add the `-` sign before a field to reverse it's order to DESC
```
GET /customers?sort=firstName -lastName
```

## Pagination
You can add the skip and limit to limit/skip the ammount of objects. Limit is by default 20
```
GET /customers?skip=10&limit=10
```

## Join
If a field is just a referense to another object, you can join them. E. g. `customer.address` is an ObjectID that points to an AddressObject, so you can:
```
GET /customers?populate=address
```
can also a space seperated list of multiple fileds to join on
```
GET /customers?populate=address addresses
```
the value of populate can either be a string with the name of the filed to populate, or an object as described in [mongoose docs](https://mongoosejs.com/docs/populate.html)
```
qs.stringify({
    populate: {
        path:'address',
        select:'city state',
        match:{
            city:{$eq:'nyc'}
        }
        //populate on the populate!!!
        populate: {
            path:'customer',
            select:'firstName',
        }
    }
})
```