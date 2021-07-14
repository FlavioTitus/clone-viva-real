const amenities  = {
  'AIR_CONDITIONING':'Ar Condicionado',
  'AMERICAN_KITCHEN':'Cozinha Americana',
  'BARBECUE_GRILL':'Churrasqueira',
  'BICYCLES_PLACE':'Bicicletário',
  'CINEMA':'Cinema',
  'ELECTRONIC_GATE':'Portaria Eletrônica',
  'ELEVATOR':'Elevador',
  'FIREPLACE':'Lareira',
  'FURNISHED':'Mobiliado',
  'GARDEN':'Jardim',
  'GATED_COMMUNITY':'Condomínio Fechado',
  'GYM':'Academia',
  'LAUNDRY':'Lavanderia',
  'PARTY_HALL':'Salão de Festas',
  'PETS_ALLOWED':'Aceita PETS',
  'PLAYGROUND':'Playground',
  'POOL':'Piscina',
  'SAUNA':'Sauna',
  'SPORTS_COURT':'Quadra de Esportes',
  'TENNIS_COURT':'Quadra de Tênis'
}

const inputCity = document.querySelector('.inputCity')
const btn = document.querySelector('.btn')
const divCards = document.querySelector('.card')
const title = document.querySelector('.title')
const totalCount = document.querySelector('.totalCount')
const cityState = document.querySelector('.cityState')
const errorMsg = document.querySelector('.errorMsg')

const property = []
let city = ''
let state = ''
let texto = ''
let totalProperties = 0

inputCity.addEventListener('input', e => {
  texto = e.target.value
})

const translate = amenity => {
  const ptBr = amenity.map( item => {
    return amenities[item]
  })
  return ptBr
}

const formatCurrency = numero => {
  const formated =  new Intl.NumberFormat('pt-br', { maximumSignificantDigits: 3,style: 'currency', currency: 'BRL' }).format(numero)
  return formated
}

btn.addEventListener('click', () => {
  totalCount.textContent = `${totalProperties} imoveis à venda em ${property.city} - ${ property.state} `
  cityState.textContent = `${property.city} - ${property.state}`
})

const getImovel = async () => {
  try {
    const response = await fetch('https://private-9e061d-piweb.apiary-mock.com/venda?state=sp&city=sao-paulo')
    const data = await response.json()
    totalProperties = data.search.totalCount
    data.search.result.listings.forEach(dt => {
      const home = {
        city: dt.listing.address.city,
        state: dt.listing.address.stateAcronym,
        street: dt.listing.address.street,
        streetNumber: dt.link.data.streetNumber,
        neighborhood: dt.listing.address.neighborhood,
        city: dt.listing.address.city,
        stateAcronym: dt.listing.address.stateAcronym,
        title: dt.listing.title,
        area: dt.listing.usableAreas[0],
        bedrooms: dt.listing.bedrooms[0],
        bathrooms: dt.listing.bathrooms[0],
        parkingSpaces: dt.listing.parkingSpaces[0],
        amenities: translate(dt.listing.amenities),
        price: formatCurrency(dt.listing.pricingInfos[0].price), 
        condoFee: formatCurrency(dt.listing.pricingInfos[0].monthlyCondoFee || 0),
        iptu: formatCurrency(dt.listing.pricingInfos[0].yearlyIptu || 0),
        img: dt.medias[0].url
      }
      property.push(home)
    })
    return data
  }
  catch(err){
    console.log(err)
    errorMsg.textContent = `Deu ruim`
  }
}

const buildHtml = () => {
  let cardPropery = ''
  property.forEach(prop => {
      cardPropery +=
    `<div class="unity">
    <div class="informations">
    <div class="address">
      <p class="addressName">${prop.street}, ${prop.streetNumber} - ${prop.neighborhood} - ${prop.city} - ${prop.stateAcronym }</p>
    </div>
    <div class="divTitle">
      <h2 class="title">${prop.title}</h2>
    </div>
    <div class="descriptionAreas">
      <p class="areas">${prop.area} m² ${prop.bedrooms}  quartos ${prop.bathrooms} banheiros ${prop.parkingSpaces} vagas</p>
    </div>
    <div class="container-amenities">
      <div class="amenities">
        <span>${prop.amenities}</span>
      </div>
    </div>
    <div class="pricingInfos">
      <h2 class="value">${prop.price}</h2>
      <p class="condoFee">Condomínio ${prop.condoFee}</p>
      <p class="iptu">IPTU ${prop.iptu}</p>
    </div>
  </div>
  <picture class="photo">
    <img src="${prop.img}" alt="" class="img">
  </picture>
  </div>`
  })
  divCards.innerHTML = cardPropery

  console.log(property)
  // console.log(totalProperties, 'qtde property', city ,state)
}

getImovel().then( (data) => {
  // console.log(data)
  // console.log(property)
  buildHtml()
})
