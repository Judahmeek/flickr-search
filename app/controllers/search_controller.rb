class SearchController < ApplicationController
  before_action :redirect_if_blank, only: [:index]

  def home
    @form = SearchForm.new
  end

  def index
    @images = Rails.cache.fetch("#{params[:search_form]}", expires_in: 3.hours) do
      @form = SearchForm.new(params[:search_form])
      @form.results
    end
  end

  def show
    @image = Image.find_by(id: params[:id])
  end

  private

  def redirect_if_blank
    if params[:search_form][:search].blank?
      # flash[:error] = "Cannot search empty field"
      redirect_to root_path
    end
  end
end
