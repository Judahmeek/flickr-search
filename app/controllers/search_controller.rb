class SearchController < ApplicationController
  before_action :redirect_if_blank, only: [:index]

  def home
    @form = SearchForm.new
  end

  def index
    @params = params[:search_form]
    Rails.cache.fetch(params[:search_form]) do
      @form = SearchForm.new(params[:search_form])
      @images = @form.results
    end
    @images
  end
  
  def images
    Rails.cache.fetch(params) do
      @form = SearchForm.new(params)
      @images = @form.results
    end
    render @images
  end

  def show
    @image = Image.find_by(id: params[:id])
  end

  private

  def redirect_if_blank
    if params[:search_form][:topic].blank?
      redirect_to root_path
    end
  end
end
