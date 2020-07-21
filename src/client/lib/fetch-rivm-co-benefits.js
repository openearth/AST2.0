export default async function fetchRivmCoBenefits() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        "successful": true,
        "errors": [],
        "warnings": [],
        "key": "6dc98ba2-8c78-4bd9-93d4-46ae05784e4d",
        "assessmentResults": [
          {
            "entries": [
              {
                "code": 1003,
                "name": "Vermindering gezondheidskosten door verwijdering van fijn stof [euro/jaar]",
                "model": "air_regulation",
                "min": 0.0,
                "max": 0.0,
                "sum": 0.0,
                "tablevalue": 0.0,
                "avg": 0.0,
                "units": "Euro/jaar",
                "class": "monetary",
              },
              {
                "code": 1027,
                "name": "Vermindering kosten artsenbezoeken door groen in de omgeving [euro/jaar]",
                "model": "green_space_and_health",
                "min": 0.0,
                "max": 0.0,
                "sum": 0.0,
                "tablevalue": 0.0,
                "avg": 0.0,
                "units": "Euros",
                "class": "monetary",
              },
              {
                "code": 1001,
                "name": "Verwijdering van PM10 door groen in de omgeving [kg/jaar]",
                "model": "air_regulation",
                "min": 0.0,
                "max": 0.0,
                "sum": 0.0,
                "tablevalue": 0.0,
                "avg": 0.0,
                "units": "kg/jaar",
                "class": "physical",
              },
              {
                "code": 1023,
                "name": "Vermindering arbeidskosten door groen in de omgeving [euro/jaar]",
                "model": "green_space_and_health",
                "min": 0.0,
                "max": 0.0,
                "sum": 0.0,
                "tablevalue": 0.0,
                "avg": 0.0,
                "units": "Euro/jaar",
                "class": "monetary",
              },
            ],
            "key": "6dc98ba2-8c78-4bd9-93d4-46ae05784e4d",
          },
        ],
      })
    }, 5000)
  })
}
