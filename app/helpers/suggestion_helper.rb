module SuggestionHelper
  def suggestions(type, amount)
    case type
      when :movie
        return movie_suggestions(amount)
      else
        return []
    end
  end

  private
  def movie_suggestions(amount)
    Movie.first(amount)
  end
end
