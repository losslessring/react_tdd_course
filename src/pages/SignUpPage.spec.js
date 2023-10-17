import SignUpPage from "./SignUpPage"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"
import {setupServer} from "msw/node"
import { rest } from "msw"

describe("Sign Up Page", () => {
    it("has header", () => {
        render(<SignUpPage />)
        const header = screen.queryByRole("heading", { name: "Sign Up" })
        expect(header).toBeInTheDocument()
    })
    it("has username input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("Username")
        expect(input).toBeInTheDocument()
    })
    it("has email input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("E-mail")
        expect(input).toBeInTheDocument()
    })
    it("has password input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("Password")
        expect(input).toBeInTheDocument()
    })
    it("has password type for password input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("Password")
        expect(input.type).toBe("password")
    })
    it("has password repeat input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("Password Repeat")
        expect(input).toBeInTheDocument()
    })
    it("has password type for password repeat input", () => {
        render(<SignUpPage/>)
        const input = screen.getByLabelText("Password Repeat")
        expect(input.type).toBe("password")
    })
    it("has Sign Up button", () => {
        render(<SignUpPage/>)
        const button = screen.queryByRole('button', {name: 'Sign Up'})
        expect(button).toBeInTheDocument()
    })
    it("disables the button initially", () => {
        render(<SignUpPage/>)
        const button = screen.queryByRole('button', {name: 'Sign Up'})
        expect(button).toBeDisabled()
    })
})

describe("Interactions", () => {

    let button
    
    const setup = () => {
        render(<SignUpPage />)
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('E-mail')

        const passwordInput = screen.getByLabelText("Password")
        const passwordRepeatInput = screen.getByLabelText("Password Repeat")
        act(() => {
            userEvent.type(usernameInput, "user1")
            userEvent.type(emailInput, "user1@mail.com")
            userEvent.type(passwordInput, "P4ssword")
            userEvent.type(passwordRepeatInput, "P4ssword")
            button = screen.queryByRole('button', {name: 'Sign Up'})
        })
        
    }

    it("enables the button when password and password repeat fields have the same value", () => {
        
        setup()
        expect(button).toBeEnabled()
    })

    it("sends username, email and password to backend after clicking the button", async () => {

        let requestBody

        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) =>{
                requestBody = req.body
                return res(ctx.status(200))
            })
        )
        server.listen()

        setup()

        act(() => {
            userEvent.click(button)
        })

        const message = "Please check your e-mail to activate your account"
        await screen.findByText(message)
        
        
        expect(requestBody).toEqual({
            username: 'user1',
            email: 'user1@mail.com',
            password: 'P4ssword'
        })

        server.close()

    })

    it("Disables button when there is an ongoing API call", async () => {

        let requestCounter = 0
        
        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {

                requestCounter += 1

                return res(ctx.status(200))
            })
        )
        server.listen()
        
        setup()

        act(() => {
            userEvent.click(button)            
        })

        act(() => {
            userEvent.click(button) 
        })

        const message = "Please check your e-mail to activate your account"
        await screen.findByText(message)
        
        expect(requestCounter).toStrictEqual(1)
        server.close()
    })

    it("Displays spinner after clicking the submit", async () => {

        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(200))
            })
        )
        server.listen()
        
        setup()
        
        expect(screen.queryByRole('status')).not.toBeInTheDocument()

        act(() => {
            userEvent.click(button)            
        })

        const spinner = screen.getByRole('status')

        expect(spinner).toBeInTheDocument()

        const message = "Please check your e-mail to activate your account"
        await screen.findByText(message)

        server.close()
    })

    it("Displays account activation notification after successful sign up request", async () => {

        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                return res(ctx.status(200))
            })
        )
        server.listen()
        
        setup()
        const message = "Please check your e-mail to activate your account"
        expect(screen.queryByText(message)).not.toBeInTheDocument()
        act(() => {
            userEvent.click(button)            
        })

        const text = await screen.findByText(message)
        expect(text).toBeInTheDocument()
        server.close()
    })

})