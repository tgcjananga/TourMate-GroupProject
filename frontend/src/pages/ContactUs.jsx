import { useState } from 'react';
import Navbar from "../components/Navbar/Navbar";
import emailjs from 'emailjs-com';

const Mailer = () => {
    const [formStatus, setFormStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm('service_z4hsf1f', 'template_g34z0ij', e.target, 'nnyiNViR3sdkDRQif')
            .then(res => {
                console.log(res);
                setFormStatus('Your message has been sent successfully!');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            })
            .catch(err => {
                console.log(err);
                setFormStatus('Failed to send the message. Please try again.');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div>
            <Navbar />
            <div className="container" style={{marginTop:'108px'}}>
                <h1>Contact Us</h1>
                <form onSubmit={sendEmail}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            className="form-control"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {formStatus && <p className="mt-3">{formStatus}</p>}
            </div>
        </div>
    );
};

export default Mailer;
