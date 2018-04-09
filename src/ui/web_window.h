/*
 * Copyright (C) 2017 ~ 2018 Deepin Technology Co., Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef DEEPIN_APPSTORE_UI_WEB_WINDOW_H
#define DEEPIN_APPSTORE_UI_WEB_WINDOW_H

#include <QAction>
#include <DMainWindow>
#include <QMenu>
class QCefWebView;

namespace dstore {

class ImageViewer;
class ImageViewerProxy;
class LogProxy;
class RecommendApp;
class SearchCompletionWindow;
class StoreDaemonProxy;
class TitleBar;
class TitleBarProxy;
class TitleBarMenu;

class WebWindow : public Dtk::Widget::DMainWindow {
  Q_OBJECT
 public:
  explicit WebWindow(QWidget* parent = nullptr);
  ~WebWindow() override;

  /**
   * Load app store main web page.
   */
  void loadPage();

  bool eventFilter(QObject* watched, QEvent* event) override;

 public slots:
  void openApp(const QString& app_name);

 protected:
  // Update width of title bar when main window is resized.
  void resizeEvent(QResizeEvent* event) override;

 private:
  void initConnections();
  void initUI();
  void initProxy();

  QCefWebView* web_view_ = nullptr;
  ImageViewer* image_viewer_ = nullptr;
  ImageViewerProxy* image_viewer_proxy_ = nullptr;
  LogProxy* log_proxy_ = nullptr;
  RecommendApp* recommend_app_ = nullptr;
  SearchCompletionWindow* completion_window_ = nullptr;
  StoreDaemonProxy* store_daemon_proxy_ = nullptr;
  TitleBar* title_bar_ = nullptr;
  TitleBarProxy* title_bar_proxy_ = nullptr;

  TitleBarMenu* tool_bar_menu_ = nullptr;

 private slots:
  void onRecommendAppActive();
};

}  // namespace dstore

#endif  // DEEPIN_APPSTORE_UI_WEB_WINDOW_H