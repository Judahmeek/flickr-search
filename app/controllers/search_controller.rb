class SearchController < ApplicationController
  before_action :redirect_if_blank, only: [:index]

  def home
    @form = SearchForm.new
  end

  def index
    @topic = params[:search_form][:topic]
  end
  
  def images
    Rails.cache.fetch(params, expires_in: 3.hours) do
      @form = SearchForm.new(params)
      @images =  @form.results
      Rails.logger.debug(@images)
      render @images
    end
  end

  def show
    @image = Image.find_by(id: params[:id])
  end

  private

  def redirect_if_blank
    if params[:search_form][:topic].blank?
      # flash[:error] = "Cannot search empty field"
      redirect_to root_path
    end
  end
end
