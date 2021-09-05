export default function(data,uid)
{

   return Object.keys(data).map(key=> {

    return{
        
               path: key,
                id:uid,
            ...data[key],

    };
    }).sort(function(a, b) {
      return (a.date < b.date) ? 1 : ((a.date > b.date) ? -1 : 0);
  });


}