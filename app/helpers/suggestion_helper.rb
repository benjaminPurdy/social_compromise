module SuggestionHelper
  def suggestions(type, amount, participants, compromise_id, movies_showing_on_suggestion_page)
    case type
      when :movie
        return movie_suggestions(amount, participants, compromise_id, movies_showing_on_suggestion_page)
      else
        return []
    end
  end

  private

  def movie_suggestions(amount, participants, compromise_id, movies_showing_on_suggestion_page)
    if (amount <= 0)
      return []
    end

    suggestions = []
    sample_user = participants.sample
    similar_movies = valid_similar_movies(sample_user, amount, compromise_id, movies_showing_on_suggestion_page)
    suggestions.concat similar_movies
    if (suggestions.count >= amount)
      return suggestions
    end
    recommendations = valid_recommendations(compromise_id, amount - suggestions.count, movies_showing_on_suggestion_page)
    suggestions.concat recommendations
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    top_movies = valid_top_movies(compromise_id, amount - suggestions.count, movies_showing_on_suggestion_page)
    suggestions.concat top_movies
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    suggestions.push(random_movies(compromise_id, amount - suggestions.count,movies_showing_on_suggestion_page))
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    puts "ERROR " * 100
    suggestions
  end

  def random_movies(compromise_id, max, movies_showing_on_suggestion_page)
    random_movies = []
    until random_movies.count == max
      offset = rand(Movie.count)
      random_movie = Movie.offset(offset).first
      if is_valid_movie?(compromise_id, random_movie, movies_showing_on_suggestion_page )
        random_movies.push(Movie.offset(offset).first)
        movies_showing_on_suggestion_page.push(random_movie)
      end
    end

    return random_movies
  end

  def valid_top_movies(compromise_id, max, movies_showing_on_suggestion_page)
    valid_top_movies = []
    top_movies = Movie.top(count: 100).shuffle
    puts "-"
    puts top_movies.inspect
    puts "-"
    top_movies.each_with_index do |top_movie, index|
      if index > 10
        return valid_top_movies
      end
      if is_valid_movie?(compromise_id, top_movie, movies_showing_on_suggestion_page)
        valid_top_movies.push top_movie
        movies_showing_on_suggestion_page.push(top_movie)
      end
      if valid_top_movies.count >= max
        return valid_top_movies;
      end
    end
    valid_top_movies

  end

  def valid_recommendations(compromise_id, max, movies_showing_on_suggestion_page)
    valid_recommendations = []
    recommendations = current_user.recommended_movies(10).shuffle
    recommendations.each do |recommendation|
      if is_valid_movie?(compromise_id, recommendation, movies_showing_on_suggestion_page)
        valid_recommendations.push recommendation
        movies_showing_on_suggestion_page.push(recommendation)
      end
      if valid_recommendations.count >= max
        return valid_recommendations;
      end
    end
    valid_recommendations
  end

  def valid_similar_movies(user, max, compromise_id, movies_showing_on_suggestion_page)
    valid_similar_movies = []
    similar_movies = current_user.liked_movies_in_common_with(user).shuffle
    similar_movies.each do |similar_movie|
      if is_valid_movie?(compromise_id, similar_movie, movies_showing_on_suggestion_page)
        valid_similar_movies.push similar_movie
        movies_showing_on_suggestion_page.push(similar_movie)
      end
      if valid_similar_movies.count >= max
        return valid_similar_movies;
      end
    end
  end

  def is_valid_movie?(compromise_id, movie, movies_showing_on_suggestion_page)
    if !has_already_voted_on_movie?(compromise_id, movie) && !is_showing_on_suggestion_page(movie, movies_showing_on_suggestion_page)
      return true;
    end
    return false;
  end

  def is_showing_on_suggestion_page(movie, movies_showing_on_suggestion_page)
    movies_showing_on_suggestion_page.each do |movie_showing|
      if movie_showing.id == movie.id
        return true;
      end
    end
    return false;
  end

  def has_already_voted_on_movie? (compromise_id, movie)
    if CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, compromise_id: compromise_id, movie_id: movie.id)
        return true;
    end
    return false;
  end
end
