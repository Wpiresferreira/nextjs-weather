"use server"
export default async function SuggestionList ({searchTerm}){
  if (searchTerm && searchTerm.length<2) return null

  const urlBase = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${process.env.API_KEY}`;
  const data = await fetch(urlBase)
  const posts = await data.json()
  console.log(posts)

  if (searchTerm && searchTerm.length<3) return null


    return(
        <tr className="even:bg-sky-500">
          {searchTerm}
        </tr>
    )
}