import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Storage from "../../core/storage";
import { getCurrentUser } from "@core/modules/user/User.api";
import { API } from "@core/network/api";
import { AxiosError, AxiosResponse } from "axios";
import { Router } from "@vaadin/router";
import { defaultStyles } from "@components/style/styles";

import "@components/design/LoadingIndicator";
import "@components/design/ErrorView";
import { provide } from "@lit/context";
import userContext from "./userContext";
import { User } from "@core/modules/user/User.types";

export const logout = () => {
  Storage.saveAuthToken(null);
  Router.go("/login");
};

@customElement("auth-container")
class AuthContainer extends LitElement {
  @provide({ context: userContext })
  user: User | null = null;
  @property()
  isLoading: boolean = false;
  @property()
  error: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();

    API.interceptors.request.use((config) => {
      const token = Storage.getAuthToken();
      console.log("Using token for requests:", token); // Log token
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    API.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error("API response error:", error); // Log error details
        if (error.response?.status === 401) {
          this.user = null;
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Fetch user
    this.isLoading = true;
    getCurrentUser()
      .then(({ data }) => {
        this.user = data;
        console.log("User data loaded:", this.user); // Log user data
      })
      .catch((error) => {
        console.error("Error fetching user:", error); // Log error details
        this.error = error.message;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  render() {
    const { isLoading, error, user } = this;

    if (error) {
      return html`<error-view error=${error} />`;
    }

    if (isLoading || !user) {
      return html`<loading-indicator></loading-indicator>`;
    }

    return html`
      <app-navigation></app-navigation>
      <section class="content">
        <app-container>
          <slot></slot>
        </app-container>
      </section>
    `;
  }

  static styles = [
    defaultStyles,
    css`
      :host {
        display: grid;
        height: 100vh;
        grid-template-columns: 14rem auto;
      }
    `,
  ];
}

export default AuthContainer;
