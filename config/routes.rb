Rails.application.routes.draw do
  resources :search, only: [:index, :show]
  get "images/:topic/:page", to: 'search#images' 
  root 'search#home'
end
