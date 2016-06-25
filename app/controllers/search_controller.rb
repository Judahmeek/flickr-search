class SearchController < ApplicationController
  before_action :redirect_if_blank, only: [:index]

  def home
    @form = SearchForm.new
  end

  def index
    @params = params[:search_form]
    @form = SearchForm.new(params[:search_form])
    @images = Rails.cache.fetch("#{@params[:topic]}#{@params[:page]}") do
      @form.results
    end
    @params[:next] = (@params[:page].to_i + 1).to_s
  end
  
  def images
    @images = Rails.cache.fetch("#{params[:topic]}#{params[:page]}") do
      SearchForm.new(params).results
    end
    render @images
  end

  def show
    @image = Image.find_by(params[:id])
  end

  private

  def redirect_if_blank
    if params[:search_form][:topic].blank?
      redirect_to root_path
    end
  end
end
