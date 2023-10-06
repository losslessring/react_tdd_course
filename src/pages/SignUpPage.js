import { Component } from 'react';
import axios from 'axios';

class SignUpPage extends Component {
    
    state = {
        username: '',
        email: '',
        password: '',
        passwordRepeat: ''

    }

    onChange = (event) => {
        const { id, value } = event.target
        this.setState({
            [id]: value
        })
    }


    submit = async (event) => {
        event.preventDefault()
        const { username, email, password } = this.state
        const body = { username, email, password }
        // try {
        //     const result = await axios.post("/api/1.0/users", body)
        // }
        // catch(error){
        //     console.log(error)
        // }

        fetch('/api/1.0/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        
    }

    render() {

        const { password, passwordRepeat } = this.state

        const disabled = password && passwordRepeat ? password !== passwordRepeat : true

        return (
            <div>
                <form>
                    <h1> Sign Up</h1>
                    <label htmlFor="username">Username</label>
                    <input id="username" onChange={this.onChange}/>
                    <label htmlFor="email">E-mail</label>
                    <input id="email" onChange={this.onChange}/>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" onChange={this.onChange}/>
                    <label htmlFor="passwordRepeat">Password Repeat</label>
                    <input id="passwordRepeat" type="password" onChange={this.onChange}/>
                    <button disabled={disabled} onClick={this.submit}>Sign Up</button>
                </form>
            </div>
        )
    }
}

export default SignUpPage