module.exports = {
    operationName: null,
    variables: {},
    query: `
    mutation {
        resetAll(allData: {
            users: [
                {
                    firstName: "e2e_name", 
                    lastName: "e2e_lastname", 
                    email: "e2e-test@user.com", 
                    password: "e2e123456", 
                    records: [
                        {
                            date: 1520971200000, 
                            distance: 5000, 
                            time: 2460
                        }
                    ]
                }
            ]
        })
    }
    `
}
