/**
 * Passing test
 */
// describe("My first test", () => {
//     it("Doesn't do much", () => {
//         expect(true).to.equal(true)
//     })
// })

/**
 * Failing test
 */
// describe("My second test", () => {
//     it("Doesn't do much", () => {
//         expect(true).to.equal(false)
//     })
// })

const API_URL = "http://localhost:8080";

// const species = "torsk";

// describe("Test filtering for a species", () => {
//     it(`Visits ${API_URL}`, () => {
//         cy.visit(API_URL)        
//         cy.get(".input").type(species)
//         cy.get(".leaflet-marker-icon").first().click()
//         cy.get(".leaflet-popup-content-wrapper").contains(species)
//     })
// })

// describe("Test going to Add Page without logging in", () => {
//     it(`Visits ${API_URL}`, () => {
//         cy.visit(API_URL)        
//         cy.get("#nav_add").click()
//         cy.contains("You have to log in")
//     })
// })

// describe("Test logging in, then logging out", () => {
//     it(`Visits ${API_URL}`, () => {
//         cy.visit(API_URL)
//         cy.get("#nav_login").click()
//         cy.get("#email").type("kjell@ullared.se")
//         cy.get("#password").type("pass123")
//         cy.get("#login").click()
//         cy.get("#flashmessage").contains("You logged in!")
//         cy.get("#nav_login").click()
//         cy.get("#flashmessage").contains("You logged out.")
//     })
// })

describe("Test logging in, adding a fishcatch, verifying it, deleting it and checking that it was deleted.", () => {
    it(`Visits ${API_URL}`, () => { // Change these descriptions. Break out into several.
        cy.visit(API_URL)
        cy.get("#nav_login").click()
        cy.get("#email").type("kjell@ullared.se")
        cy.get("#password").type("pass123")
        cy.get("#login").click()
        cy.wait(1000)
        cy.get("#nav_add").click()
        cy.get("#add_input_species").type("makrill")
        cy.get("#add_input_weight").type("500")
        cy.get("#add_input_length").type("45")
        cy.get("#add_input_date").type("2022-02-05")
        cy.get("#map").click(250,250)
        cy.get("#uploadImageLabel").click()
        // cy.get("#add_catch").click()

        // cy.wait(2000) // remove later
        // cy.get("#nav_login").click()

    })
})
